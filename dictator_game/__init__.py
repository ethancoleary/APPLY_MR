from otree.api import *
import random, time

"""Dictator game

Queue‑based matching: the first two waiting participants form a pair.  
Treatments are assigned **only after a pair is formed**, using three separate
urns that balance treatments within (i) male‑male pairs, (ii) female‑female
pairs, and (iii) mixed‑gender pairs.  
Participants who remain alone for `MAX_WAIT_SECONDS` are released as solos and
receive a code drawn from a gender‑specific solo urn that only contains
IMAGE‑OFF variants, so they never wait for a peer reveal.
"""


class C(BaseConstants):
    NAME_IN_URL = "dictator_game"
    PLAYERS_PER_GROUP = None
    ENDOWMENT = 100
    NUM_ROUNDS = 1

    # treatment codes: first digit = impact (0 Relieves, 1 Adds, 2 Neutral)
    # second digit = image  (0 IMAGE‑OFF, 1 IMAGE‑ON)
    treatment_codes = ["10", "11", "00", "01", "20", "21"]
    image_off_codes  = [c for c in treatment_codes if c[1] == "0"]

    BLOCKS_PER_URN = 200            # capacity per pair‑type or gender urn
    MAX_WAIT_SECONDS = 60           # release solo after this many seconds


# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    skip_reveal = models.BooleanField(initial=False)


class Player(BasePlayer):
    impact_level   = models.IntegerField()  # 0 = Relieves, 1 = Adds, 2 = Neutral
    image_on       = models.BooleanField()
    donation       = models.IntegerField(min=0, max=C.ENDOWMENT)
    peer_code      = models.StringField()
    treatment_code = models.StringField()
    peer_donation  = models.IntegerField()
    peer_missing   = models.BooleanField(initial=False)

    arrival_ts     = models.FloatField()     # unix time stamp when they entered WP

    browser        = models.StringField(blank=True)
    blur_count     = models.IntegerField(initial=0)
    blur_log       = models.LongStringField(blank=True)
    blur_warned    = models.BooleanField(initial=False)

    @property
    def impact_on(self):
        return self.impact_level == 1


# -----------------------------------------------------------------------------
# Urn helpers
# -----------------------------------------------------------------------------

def _build_urn(blocks: int, codes: list[str]):
    urn: list[str] = []
    for _ in range(blocks):
        block = codes[:]
        random.shuffle(block)
        urn.extend(block)
    return urn


def _get_pair_urn_key(g1: str, g2: str):
    if g1 == g2 == "M":
        return "urn_pair_MM"
    if g1 == g2 == "F":
        return "urn_pair_FF"
    return "urn_pair_MF"  # any mixed‑gender combination


def assign_pair_treatment(players: list[Player]):
    """Give the *same* treatment to both players, balanced within the
    corresponding pair‑type urn."""

    g1 = players[0].participant.vars.get("gender", "X")
    g2 = players[1].participant.vars.get("gender", "X")
    urn_key = _get_pair_urn_key(g1, g2)

    if urn_key not in players[0].session.vars:
        players[0].session.vars[urn_key] = _build_urn(C.BLOCKS_PER_URN, C.treatment_codes)

    if not players[0].session.vars[urn_key]:
        raise ValueError(f"Urn {urn_key} exhausted – increase BLOCKS_PER_URN.")

    code = players[0].session.vars[urn_key].pop(0)
    for p in players:
        p.impact_level   = int(code[0])
        p.image_on       = code[1] == "1"
        p.treatment_code = code
        p.participant.vars["treatment"] = code


def assign_single_treatment(player: Player):
    """Solo players get an IMAGE‑OFF treatment from their gender‑specific urn."""
    gender = player.participant.vars.get("gender", "X")
    urn_key = f"urn_solo_{gender}"

    if urn_key not in player.session.vars:
        player.session.vars[urn_key] = _build_urn(C.BLOCKS_PER_URN, C.image_off_codes)

    if not player.session.vars[urn_key]:
        raise ValueError(f"Urn {urn_key} exhausted – increase BLOCKS_PER_URN.")

    code = player.session.vars[urn_key].pop(0)
    player.impact_level   = int(code[0])
    player.image_on       = False
    player.treatment_code = code
    player.participant.vars["treatment"] = code


# -----------------------------------------------------------------------------
# Group‑by‑arrival logic
# -----------------------------------------------------------------------------

def group_by_arrival_time_method(subsession, waiting_players):
    now = time.time()

    # timestamp new arrivals safely (null‑field safe)
    for p in waiting_players:
        if p.field_maybe_none("arrival_ts") is None:
            p.arrival_ts = now

    # sort by arrival order so the two earliest waiting always pair first
    waiting_players.sort(key=lambda x: x.arrival_ts)

    # (1) pair immediately if 2+ players are waiting
    if len(waiting_players) >= 2:
        pair = waiting_players[:2]
        assign_pair_treatment(pair)
        return pair

    # (2) solo release after timeout
    if waiting_players:
        p = waiting_players[0]
        if now - p.arrival_ts >= C.MAX_WAIT_SECONDS:
            assign_single_treatment(p)
            return [p]

    # (3) otherwise keep waiting
    return None

# -----------------------------------------------------------------------------
# Pages
# -----------------------------------------------------------------------------
class MatchWait(WaitPage):
    """FIRST wait‑page – create pairs & assign treatments."""
    group_by_arrival_time = True
    timeout_seconds = C.MAX_WAIT_SECONDS + 5  # give five‑second cushion


class Dictator(Page):
    form_model = "player"
    form_fields = [
        "donation",
        "browser",
        "blur_count",
        "blur_log",
        "blur_warned",
    ]

    @staticmethod
    def vars_for_template(player: Player):
        return dict(
            impact_level=player.impact_level,
            image_on=player.image_on,
            endowment=C.ENDOWMENT,
        )

    @staticmethod
    def error_message(player, values):
        try:
            x = int(values["donation"])
        except (TypeError, ValueError):
            return "Enter a whole number between 0 and 100."
        if not (0 <= x <= C.ENDOWMENT):
            return "Between 0 and 100."


class SyncWait(WaitPage):
    """SECOND wait‑page – just sync within each mini‑group."""
    wait_for_all_groups = False
    timeout_seconds = 30

    @staticmethod
    def after_all_players_arrive(group: Group):
        players = group.get_players()
        if len(players) == 2:
            p1, p2 = players
            # exchange the last 4 digits of codes & donations
            p1.peer_code, p2.peer_code = p2.participant.code[-4:], p1.participant.code[-4:]
            p1.peer_donation, p2.peer_donation = p2.donation, p1.donation
        else:
            p = players[0]
            p.peer_missing = True
            group.skip_reveal = True


class Reveal(Page):
    form_model = "player"
    form_fields = ["browser", "blur_count", "blur_log", "blur_warned"]

    @staticmethod
    def is_displayed(player: Player):
        return player.image_on and not player.peer_missing

    @staticmethod
    def vars_for_template(player: Player):
        # Your & sponsor amounts for you
        if player.impact_level == 1:  # adds
            sponsor_amt = 1.00
            you_amt = player.donation / 100
        elif player.impact_level == 0:  # relieves
            sponsor_amt = 1 - player.donation / 100
            you_amt = player.donation / 100
        else:  # neutral burn
            sponsor_amt = 1.00
            you_amt = 0.00

        # Peer amounts (need same impact logic)
        if player.impact_level in (0, 1):
            peer_you_amt = player.peer_donation / 100
        else:
            peer_you_amt = 0.00

        if player.impact_level == 0:
            peer_sponsor_amt = 1 - player.peer_donation / 100
        else:
            peer_sponsor_amt = 1.00

        return dict(
            peer_code=player.peer_code,
            peer_keep_amount=f"{(1 - player.peer_donation / 100):.2f}",
            peer_you_amount=f"{peer_you_amt:.2f}",
            peer_sponsor_amt=f"{peer_sponsor_amt:.2f}",
            keep_amount=f"{(1 - player.donation / 100):.2f}",
            sponsor_amount=f"{sponsor_amt:.2f}",
            you_amount=f"{you_amt:.2f}",
            total_charity=f"{sponsor_amt + you_amt:.2f}",
            peer_total_charity=f"{peer_sponsor_amt + peer_you_amt:.2f}",
        )


page_sequence = [MatchWait, Dictator, SyncWait, Reveal]
