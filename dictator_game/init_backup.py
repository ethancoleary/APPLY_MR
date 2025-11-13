from otree.api import *
import random

doc = """Dictator game"""

class C(BaseConstants):
    NAME_IN_URL = 'dictator_game'
    PLAYERS_PER_GROUP = None          
    ENDOWMENT = 100                   
    NUM_ROUNDS = 1

    treatment_codes      = ['10', '11', '00', '01', '20', '21']   # 0 = Relieves, 1 = Adds, 2 = Neutral
                                                                  # second digit 0/1 = IMAGE OFF/ON
    BLOCK_SIZE           = len(treatment_codes)                   # 6
    BLOCKS_PER_GENDER    = 200 

class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    skip_reveal = models.BooleanField(initial=False)

class Player(BasePlayer):
    impact_level = models.IntegerField()  
    image_on     = models.BooleanField()
    donation     = models.IntegerField(min=0, max=C.ENDOWMENT)
    peer_code    = models.StringField()
    treatment_code = models.StringField()
    peer_donation= models.IntegerField()
    peer_missing = models.BooleanField(initial=False)

    browser        = models.StringField(blank=True)   
    blur_count     = models.IntegerField(initial=0)
    blur_log       = models.LongStringField(blank=True)
    blur_warned    = models.BooleanField(initial=False)

    @property
    def impact_on(self):
        return self.impact_level == 1   


def assign_treatment(player: Player):
    gender  = player.participant.vars.get('gender', 'X')
    urn_key = f'urn_{gender}'

    # build the urn once per gender
    if urn_key not in player.session.vars:
        blocks = []
        for _ in range(C.BLOCKS_PER_GENDER):
            block = C.treatment_codes[:]   # copy
            random.shuffle(block)        # permute within the block
            blocks.extend(block)         # append to master list
        player.session.vars[urn_key] = blocks

    if not player.session.vars[urn_key]:
        raise ValueError(
            f"Urn for gender {gender} exhausted. "
            "Increase BLOCKS_PER_GENDER or total capacity."
        )

    code = player.session.vars[urn_key].pop(0)   # pop from front → keeps block order
    player.impact_level = int(code[0])           # 0=Relieve, 1=Add, 2=Neutral
    player.image_on     = code[1] == '1'
    player.treatment_code = code
    player.participant.vars['treatment'] = code


def group_by_arrival_time_method(subsession, waiting_players):
    # 1) make sure every arriving player has a treatment
    for p in waiting_players:
        if 'treatment' not in p.participant.vars:
            assign_treatment(p)

    # 2) try to find 2 IMAGE-ON players with same impact_level
    for p in waiting_players:
        for q in waiting_players:
            if (
                p is not q
                and p.image_on and q.image_on
                and p.impact_level == q.impact_level
            ):
                return [p, q]          # matched pair

    # 3) let IMAGE-OFF players leave immediately
    for p in waiting_players:
        if not p.image_on:
            return [p]                # single-person “group”

class MatchWait(WaitPage):
    """FIRST page – give everyone a treatment & make the pairs."""
    group_by_arrival_time = True
    timeout_seconds = 30           # 5-minute max wait
            

class Dictator(Page):
    form_model = 'player'
    form_fields = ['donation',            
                   'browser', 'blur_count', 'blur_log', 'blur_warned']

    @staticmethod
    def vars_for_template(player):

        return dict(
            impact_level = player.impact_level,   
            image_on  = player.image_on,
            endowment = C.ENDOWMENT,
        )

    @staticmethod
    def error_message(player, values):
        x = values['donation']
        try:
            x = int(x)
        except (TypeError, ValueError):
            return "Enter a whole number between 0 and 100."
        if not (0 <= x <= C.ENDOWMENT):
            return "Between 0 and 100."

class SyncWait(WaitPage):
    """SECOND wait-page – just make sure group members all finished."""
    wait_for_all_groups = False      # only within each mini-group
    timeout_seconds = 30

    @staticmethod
    def after_all_players_arrive(group):
        players = group.get_players()
        if len(players) == 2:         # IMAGE-ON pair
            p1, p2 = players
            p1.peer_code, p2.peer_code = p2.participant.code[-4:], p1.participant.code[-4:]
            p1.peer_donation, p2.peer_donation = p2.donation, p1.donation
        else:                         # IMAGE-OFF or time-out singleton
            p = players[0]
            p.peer_missing = True
            group.skip_reveal = True


class Reveal(Page):
    form_model  = 'player'
    form_fields = ['browser', 'blur_count', 'blur_log', 'blur_warned']

    @staticmethod
    def is_displayed(player):
        return player.image_on and not player.peer_missing

    @staticmethod
    def vars_for_template(player):
        # ----------  sponsor and participant contributions ----------
        if player.impact_level == 1:                       # adds
            sponsor_amt = 1.00
            you_amt     = player.donation / 100
        elif player.impact_level == 0:                     # crowd-out
            sponsor_amt = 1 - player.donation / 100
            you_amt     = player.donation / 100
        else:                                              # burn / neutral
            sponsor_amt = 1.00
            you_amt     = 0.00

        # ----------  peer line needs the same treatment logic ----------
        if player.impact_level in (0, 1):                  # crowd-out OR adds
            peer_you_amt = player.peer_donation / 100
        else:                                              # burn / neutral
            peer_you_amt = 0.00

        # lead-donor part of the peer's decision
        if player.impact_level == 0:                       # crowd-out
            peer_sponsor_amt = 1 - player.peer_donation / 100
        else:                                              # adds or burn
            peer_sponsor_amt = 1.00

        return dict(
            peer_code         = player.peer_code,
            peer_keep_amount  = f"{(1 - player.peer_donation / 100):.2f}",
            peer_you_amount   = f"{peer_you_amt:.2f}",
            peer_sponsor_amt  = f"{peer_sponsor_amt:.2f}",
            keep_amount       = f"{(1 - player.donation / 100):.2f}",
            sponsor_amount    = f"{sponsor_amt:.2f}",
            you_amount        = f"{you_amt:.2f}",
            total_charity     = f"{sponsor_amt + you_amt:.2f}",
            peer_total_charity = f"{peer_sponsor_amt + peer_you_amt:.2f}",
        )




page_sequence = [
    MatchWait,     
    Dictator,    
    SyncWait,      
    Reveal,        
]
