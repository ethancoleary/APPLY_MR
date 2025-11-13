from otree.api import *
import random
from common import *


doc = '''
Third app - Exit survey.
'''

class C(CommonConstants):
    NAME_IN_URL = 'Exit_Survey'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1

    LIKERT_IMPROVEMENT = [
    [1, 'Not at all'],
    [2, 'Slightly'],
    [3, 'Somewhat'],
    [4, 'Quite a bit'],
    [5, 'A lot'],
    ]
    
     
    
      

    



class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass

class Player(BasePlayer):   

    field_of_study = models.LongStringField(blank=True, label="(If student) Towards which degree are you studying? (e.g. Bachelor's in Economics, Masters in Psychology, etc.)")
    year_of_study = models.StringField(blank=False, label='If you are currently studying, what year of your studies are you in?',
                                       choices=['1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year+', 'I am not a student'], widget=widgets.RadioSelect)
    #belief round 1
    Belief_Round1a = models.IntegerField()
    Belief_Round1b = models.IntegerField()
    Belief_Round1c = models.IntegerField()

    #belief round 2
    Belief_Round2 = models.IntegerField(min=0, max=100)

    #belief discrimination
    Belief_discrimination = models.IntegerField(min=0, max=20)

    #belief selection
    Belief_selection = models.IntegerField(min=0, max=100)

    #Explain choice
    Explanation = models.LongStringField()

    #Selection
    Manager_Selection = models.LongStringField()
    Improve_Selection_Mix = models.IntegerField(
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
        initial=0
    )
    Improve_Selection_Avatar = models.IntegerField(
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
        initial=0
    )
    Improve_Selection_Score = models.IntegerField(
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
        initial=0
    )

    #Others
    Ethnicity = models.IntegerField(
        choices=[
            [1, 'Arab'],
            [2, 'East Asian/ East Asian British'],
            [3, 'South Asian/ South Asian British'],
            [4, 'Other Asian/ Other Asian British'],
            [5, 'Black/ African/ Caribbean/ Black British'],
            [6, 'Mixed/ Multiple Ethnicity: White and Black Caribbean'],
            [7, 'Mixed/ Multiple Ethnicity: White and Black African'],
            [8, 'Mixed/ Multiple Ethnicity: White and Asian'],
            [9, 'White'],
            [10, 'Other']
        ],
        widget=widgets.RadioSelect
    )
    Political_Leaning = models.IntegerField(
        choices=[
            [1, 'Labour'],
            [2, 'Conservative'],
            [3, 'Liberal Democrats'],
            [4, 'Reform UK'],
            [5, 'Scottish National Party'],
            [6, 'Sinn Féin'],
            [7, 'Green Party'],
            [8, 'Plaid Cymru'],
            [9, 'Democratic Unionist Party (DUP)'],
            [10, 'Other/I would not vote']
        ],
        widget=widgets.RadioSelect
    )
    Past_discrim = models.IntegerField(
        choices = [
            [1, 'Yes'],
            [2, 'No'],
            [3, 'Not sure']
        ],
        widget=widgets.RadioSelect
    )
    discrim_identity_age = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
    )
    discrim_identity_gender = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,

    )
    discrim_identity_race = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
    )
    discrim_identity_disability = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        widget=widgets.RadioSelect,
        blank=True,
    )
    discrim_identity_religion = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
    )
    discrim_identity_sex = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
    )
    discrim_identity_other = models.IntegerField(
        initial=0,
        choices=[
            [0, 'No'],
            [1, 'Yes']
        ],
        blank=True,
    )
    discrim_pref = models.IntegerField(
        choices=[
            [0, 'Worse'],
            [1, 'Better']
        ],
        widget=widgets.RadioSelect,
        blank=True
    )

    # Likert scale
    Improve_Selection_Mix_Scale = models.IntegerField(
        choices=C.LIKERT_IMPROVEMENT,
        widget=widgets.RadioSelectHorizontal,
    )
    Improve_Selection_Avatar_Scale = models.IntegerField(
        choices=C.LIKERT_IMPROVEMENT,
        widget=widgets.RadioSelectHorizontal,
    )
    Improve_Selection_Score_Scale = models.IntegerField(
        choices=C.LIKERT_IMPROVEMENT,
        widget=widgets.RadioSelectHorizontal,
    )
    Improve_Selection_Avatar_Text = models.LongStringField(blank=True)


    # data quality
    blur_log = models.LongStringField(blank=True)
    blur_count = models.IntegerField(initial=0, blank=True)
    blur_warned = models.IntegerField(initial=0, blank=True)





#%% Pages
class Beliefs_Introduction(MyBasePage):
    pass

class Beliefs_Round_1(MyBasePage):
    extra_fields = ['Belief_Round1a', 'Belief_Round1b', 'Belief_Round1c']
    form_fields = MyBasePage.form_fields + extra_fields

class Beliefs_Round_2(MyBasePage):
    extra_fields = ['Belief_Round2']
    form_fields = MyBasePage.form_fields + extra_fields


class Beliefs_Discrimination(MyBasePage):
    extra_fields = ['Belief_discrimination']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def vars_for_template(player):
        base = MyBasePage.vars_for_template(player)

        t = player.participant.Treatment
        is_recruiter = t in C.Recruiter_Treatments

        if t in {1, 9}:
            discrim_img = 'graphics/discrim_neutral.png'
        elif t in {2, 3, 4, 5, 6, 7, 8}:
            discrim_img = 'graphics/discrim_female.png'
        elif t in {10, 11, 12, 13, 14, 15, 16}:
            discrim_img = 'graphics/discrim_male.png'
        else:
            discrim_img = None  # fallback: hide image if an unexpected treatment shows up

        role_label = 'Recruiter' if is_recruiter else 'Manager'

        base.update({
            'role_label': role_label,
            'discrim_img': discrim_img,
        })
        return base

class Beliefs_Selection_Round_3(MyBasePage):
    extra_fields = ['Belief_selection']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def vars_for_template(player: Player):
        # inherit base vars: task, rates, etc.
        base = MyBasePage.vars_for_template(player)

        t = player.participant.Treatment
        is_recruiter = t in C.Recruiter_Treatments
        selector_role = 'Recruiter' if is_recruiter else 'Manager'

        # ==== Manager-view image logic ====
        if t in (1, 8, 9, 16):
            manager_view_img = 'graphics/Manager_view_neutral.png'
        else:
            manager_view_img = 'graphics/Manager_view_reveal.png'

        base.update({
            'is_recruiter': is_recruiter,     
            'selector_role': selector_role,   
            'manager_view_img': manager_view_img,
        })
        return base

class Survey_Explain_Choice(MyBasePage):
    extra_fields = ['Explanation']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def vars_for_template(player: Player):
        # inherit all base vars: piece_rate, tournament_rate1, task, etc.
        base = MyBasePage.vars_for_template(player)

        t = player.participant.Treatment
        selector_role = 'Recruiter' if t in C.Recruiter_Treatments else 'Manager'

        base.update({'selector_role': selector_role})
        return base

class Survey_Explain_Manager(MyBasePage):
    extra_fields = ['Manager_Selection',
                    'Improve_Selection_Mix_Scale',
                    'Improve_Selection_Avatar_Scale',
                    'Improve_Selection_Score_Scale',
                    'Improve_Selection_Avatar_Text',
                    ]
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def error_message(player: Player, values):
        avatar_scale = values.get('Improve_Selection_Avatar_Scale')
        avatar_text = (values.get('Improve_Selection_Avatar_Text') or '').strip()
        # Require text only if scale is 3+ ("Somewhat", "Quite a bit", "A lot")
        if avatar_scale and int(avatar_scale) >= 3 and not avatar_text:
            return 'Please describe briefly how the avatar would have needed to differ.'

class Survey_Final(MyBasePage):
    extra_fields = [
        'Ethnicity',
        'Political_Leaning',
        'Past_discrim',
        'discrim_identity_age',
        'discrim_identity_gender',
        'discrim_identity_race',
        'discrim_identity_disability',
        'discrim_identity_religion',
        'discrim_identity_sex',
        'discrim_identity_other',
        'discrim_pref',
    ]
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        round_for_payment = random.randint(1,3)
        page_for_payment = random.randint(1, 4)

        player.participant.round_for_payment = round_for_payment
        player.participant.page_for_payment = page_for_payment


class Results(Page):

    @staticmethod
    def is_displayed(player):
        return True

    @staticmethod
    def vars_for_template(player):
        # Draws that were set earlier
        paid_round = getattr(player.participant, 'round_for_payment', 1)
        paid_page  = getattr(player.participant, 'page_for_payment', 1)

        # Who is decisive for Payment Rule B?
        t = getattr(player.participant, 'Treatment', None)
        selector_role = 'Recruiter' if (t in C.Recruiter_Treatments) else 'Manager'

        # Rates (fall back to sensible defaults if not on CommonConstants)
        piece_rate       = getattr(CommonConstants, 'Piece_rate', 0.05)
        tournament_rate1 = getattr(CommonConstants, 'Tournament_rate1', 0.20)

        # Scores (default to 0 if not set)
        r1 = getattr(player.participant, 'R1_score', 0) or 0
        r2 = getattr(player.participant, 'R2_score', 0) or 0  # not used for payout calc, but fine to keep
        r3 = getattr(player.participant, 'R3_score', 0) or 0
        choice = getattr(player.participant, 'Choice', None)

        # Compute the (potential) bonus shown
        # R1: guaranteed piece-rate on R1
        # R2: potential tournament payout based on R1 (winner-takes); show potential
        # R3: A = guaranteed piece-rate on R3; B = potential tournament payout on R3 (if selected)
        bonus_amount = 0.0
        if paid_round == 1:
            bonus_amount = r1 * piece_rate
        elif paid_round == 2:
            bonus_amount = r1 * tournament_rate1 * piece_rate
        elif paid_round == 3:
            if choice == 1:
                bonus_amount = r3 * piece_rate
            elif choice == 2:
                bonus_amount = r3 * tournament_rate1 * piece_rate
            else:
                bonus_amount = 0.0

        # Provide exactly what the template uses; also include readable rates if you want them
        return dict(
            round=paid_round,                 # used by template
            page=paid_page,                   # used by template
            bonus=f"{bonus_amount:.2f}",      # used by template
            selector_role=selector_role,      # used by template

            # (optional) expose formatted rates if you want to show them anywhere
            piece_rate=f"{piece_rate:.2f}",
            tournament_rate1=f"{tournament_rate1:.2f}",

            # (optional) raw values in case you need them later
            round_for_payment=paid_round,
            page_for_payment=paid_page,
            bonus_amount=bonus_amount,
        )


   # @staticmethod
   # def is_displayed(player):
    #    return True  # or put your condition here

   # @staticmethod
    #def vars_for_template(player):

     #   round = player.participant.round_for_payment
      #  page = player.participant.page_for_payment

       # if round == 1:
        #    bonus = player.participant.R1_score * 0.05
            #bonus = 1.15
        #elif round == 3:
         #   if player.participant.Choice == 2:
          #      bonus = player.participant.R3_score * 0.05
                #bonus = 1.15
        #elif round == 2:
            #bonus = 4.60
         #   bonus = player.participant.R1_score * 0.2

        #return dict(
         #   round=round,
          #  page=page,
           # bonus="{:.2f}".format(bonus)
        #)
    



    
# Only for pilot
class Pilot(MyBasePage):
    extra_fields = ['Pilot_1','Pilot_2','Pilot_3','Pilot_4','Pilot_5','Pilot_6']
    form_fields = MyBasePage.form_fields + extra_fields
    
        
page_sequence = [
    Beliefs_Introduction,
    Beliefs_Round_1,
    Beliefs_Round_2,
    Beliefs_Selection_Round_3,
    Beliefs_Discrimination,
    Survey_Explain_Choice,
    Survey_Explain_Manager,
    Survey_Final, 
    Results
    ]
