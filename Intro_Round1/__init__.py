from otree.api import *
import random
from django.utils.safestring import mark_safe
from common import *



doc = '''
This is the first app - the Introduction app. It contains
1. Demgraphics page
2. Instructions that participants can always access
3. Comprehension checks 
4. and the first attention checks
Following are saved to the participant level
- Allowed: if they didnt fail the comprehension checks
- Comprehension_passed: whether they passed the comprehension checks
- Attention_1: whether they passed the first attention check
- Treatment: which treatment they are assigned to
'''


def get_treatment_part(part, player):
    'returns the part of the treatment that is relevant for the player'
    'i.e. if treatment="T1_Math_men" and part=1, it returns "Math"'
    return player.participant.Treatmentstring.split('_')[part]

class C(CommonConstants):
    NAME_IN_URL = 'Introduction'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    Round_length = 120 # change to 120
    Round_length_min = int(Round_length / 60)
    Timer_text = "Time left to complete this round:"  
    

    # Treatment quotas. This will be copied to the session variable.
    MathMemory_pic = 'https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/MathMemory_pic.png'

    
    # If instead you want a non-gender balanced treatment assignment with quotas remove one of these and use it for both genders.
    Female_quotas = {
    '1_M_N_N_N': 0,
    '2_M_Y_N_N': 0,
    '9_E_N_N_N': 0,
    '10_E_Y_N_N': 0,
    '4_M_Y_YM_M': 0,
    }
    
    Male_quotas = {
    '1_M_N_N_N': 0,
    '2_M_Y_N_N': 0,
    '9_E_N_N_N': 0,
    '10_E_Y_N_N': 0,
    '4_M_Y_YM_M': 0,
    }
class Subsession(BaseSubsession):
    pass

def creating_session(subsession):
    '''
    1. create the quotas for each treatment to be saved to the session variable
        - make sure that in the settings.py file the SESSION_FIELDS has initialized the session variables
    2. These quotas are initially zero but as participants are assigned they are incremented. 
    - It is important to note that although prolific ensures gender balanced sample,
        we need this balancing to be within treatment level also
    '''
    subsession.session.Male_quotas = C.Male_quotas.copy()
    subsession.session.Female_quotas = C.Female_quotas.copy()
        
    subsession.session.T1_Quota_male = C.Male_quotas.copy()
    subsession.session.T1_Quota_female = C.Female_quotas.copy()
    
    for player in subsession.get_players():
        player.Allowed = True
        player.participant.Promised = True
        player.participant.Comprehension_passed = False 
        player.participant.Attention_passed = True
        player.participant.Blur_warned = 0

        
        # create and save Group_members to the participant variable
        
            

class Group(BaseGroup):
    pass

class Player(BasePlayer):
    treatment = models.IntegerField()
    # Demographics
    # prolific_id = models.StringField(default=str("None")) #prolific id, will be fetched automatically.
    gender = models.StringField(label='What is your gender identity?',
                                choices=['Male', 'Female', 'Other', 'Rather not say'], widget=widgets.RadioSelect)
    age = models.IntegerField( label='How old are you?', min=18, max=99)
    country = models.StringField(label='In which country do you live?')
    job = models.StringField(label='What is your employment status?',
                                choices=['Unemployed', 'Part-time', 'Full-time', 'Student', 'Retired', 'Other'], widget=widgets.RadioSelect)


    'Comprehension and attention checks'
    #whether the player got the comprehension questions right at the first try
    CQ1 = models.IntegerField(
        choices = [
            [1, 'Pair A'],
            [2, 'Pair B'],
            [3, 'Pair C']],
        label='Easy match pairs',
        widget=widgets.RadioSelect
    )
    CQ1_incorrect = models.IntegerField(initial=0)

    CQ2 = models.IntegerField(
        choices=[
            [1, 'Pair A'],
            [2, 'Pair B'],
            [3, 'Pair C']],
        label='Hard match pairs',
        widget=widgets.RadioSelect
    )
    CQ2_incorrect = models.IntegerField(initial=0)

    CQ3 = models.IntegerField(
        choices = [
            [1, '60'],
            [2, '90'],
            [3, '120'],
            [4, '150']
        ],
        label='Duration of rounds',
        widget=widgets.RadioSelect
    )
    CQ3_incorrect = models.IntegerField(initial=0)

    CQ4 = models.IntegerField(
        choices=[
            [1, ''],
            [2, ''],
            [3, ''],
            [4, '']
        ],
        label='Skill',
        widget=widgets.RadioSelect
    )
    CQ4_incorrect = models.IntegerField(initial=0)
    cq_page_2 = models.IntegerField(initial=0)
    CQ_fail = models.IntegerField(initial=0)



    Comprehension_password = models.StringField(blank=False,
                                                label='Password')
    

    Promise = models.BooleanField(
        choices=[
            (True,  mark_safe('I promise')),
            (False, mark_safe('I cannot promise')),
        ],
        label=mark_safe('Do you <b>promise</b> to complete this study in one sitting and without clicking out of the browser window?'),
        widget=widgets.RadioSelect,
    )
    
    browser = models.StringField(
        label='Please enter your browser name and version (e.g. Chrome 100.0.4896.127)',
        blank=True,
    )
    Allowed = models.IntegerField(initial=1)

    Piece_rate = models.IntegerField(initial=0) #correct answers
    Piece_rate_Attempts = models.IntegerField(initial=0, blank=True) # logs the number of attempts in the math memory game
    ai_catch_answer = models.StringField(blank=True, max_length=4)
    honeypot = models.StringField(
        label='Please enter your browser name and version (e.g. Chrome 100.0.4896.127)',
        blank=True,
    )

    # data quality
    blur_log = models.LongStringField(blank=True)
    blur_count = models.IntegerField(initial=0, blank=True)
    blur_warned = models.IntegerField(initial=0, blank=True)
    
    
#%% Functions
def treatment_assignment(player):
    session = player.subsession.session

    # Initialize quota dictionaries if they don't exist
    if not hasattr(session, 'Male_quotas'):
        session.Male_quotas = {str(i): 0 for i in range(1, 6)}
    if not hasattr(session, 'Female_quotas'):
        session.Female_quotas = {str(i): 0 for i in range(1, 6)}

    if player.gender == 'Male':
        Quotas = session.Male_quotas
    elif player.gender == 'Female':
        Quotas = session.Female_quotas
    else:
        # Default or error handling if gender not recognized
        Quotas = session.Male_quotas  # or handle otherwise

    # Treatments allowed with count less than 900
    allowed_treatments = [t for t, count in Quotas.items() if count < 900]

    if not allowed_treatments:
        # If all treatments full, assign randomly or handle differently
        treatment = random.choice(list(Quotas.keys()))
    else:
        # Randomly pick one treatment with quota available
        treatment = random.choice(allowed_treatments)

    player.participant.Treatmentstring = treatment
    player.participant.Gender = player.gender

    # Update quota count
    Quotas[treatment] += 1

    # Save back the updated quotas
    if player.gender == 'Male':
        session.Male_quotas = Quotas
    else:
        session.Female_quotas = Quotas


# PAGES
#%% Base Pages


#%% Pages

#Consent, Demographics, Introduction, Comprehension checks and attention check 1
class Welcome(Page):
    pass

class AI_catch(Page):   
    form_model = 'player'
    form_fields = ['ai_catch_answer', 'honeypot']

    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1

    @staticmethod
    def error_message(player, values):
        # Normalize: strip spaces and uppercase
        entered = (values.get('ai_catch_answer') or '').replace(' ', '').upper()
        if entered != 'A8F':
            return 'That entry does not match. Please type the 3 characters you see.'

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):

        if player.honeypot != "":
            player.Allowed = 0

class Aboutyou(Page):
    form_model = 'player'
    form_fields = [
                'gender',
                'age',
                'country',
                'job',
                'blur_log',
                'blur_count',
                'blur_warned',
                'browser'
                ]
    
    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1
        
    @staticmethod
    def vars_for_template(player: Player):

        return {
            'hidden_fields': ['blur_log', 'blur_count','blur_warned', 'browser'],
        }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        treatment_assignment(player)  # assign treatment and update quotas
        player.participant.Treatment = int(get_treatment_part(0, player))
        player.treatment = int(get_treatment_part(0, player))
        
class Instructions(MyBasePage):

    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1


class Round_1_begin(Page):
    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1
    
class Round_1_play_easy(MyBasePage):
    extra_fields = ['Piece_rate','Piece_rate_Attempts'] 
    form_fields = MyBasePage.form_fields + extra_fields
    
    timeout_seconds = C.Round_length/2  # set to 60 later
    timer_text = C.Timer_text

    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Piece_rate', 'Piece_rate_Attempts']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        # Start from zero on the first (easy) minute
        return {
            'field_name': 'Piece_rate',
            'treatment_num': player.participant.Treatment,
            'round_index': 1,
            'mix': None,
            'phase': 'easy',          # NEW
            'start_value': 0,         # NEW: matches carried-in ImgFound
            'attempts_start': 0,      # NEW
        }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        # park the easy minute results to participant vars
        player.participant.vars['R1_easy'] = player.Piece_rate
        player.participant.vars['R1_easy_attempts'] = player.Piece_rate_Attempts


class Round_1_play_hard(MyBasePage):
    extra_fields = ['Piece_rate','Piece_rate_Attempts'] 
    form_fields = MyBasePage.form_fields + extra_fields
    
    timeout_seconds = C.Round_length/2  # set to 60 later
    timer_text = C.Timer_text

    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)
        for _ in ['Piece_rate', 'Piece_rate_Attempts']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        # Continue from where the easy minute stopped
        r1_easy = player.participant.vars.get('R1_easy', 0)
        r1_easy_att = player.participant.vars.get('R1_easy_attempts', 0)
        return {
            'field_name': 'Piece_rate',
            'treatment_num': player.participant.Treatment,
            'round_index': 1,
            'mix': None,
            'phase': 'hard',            # NEW
            'start_value': r1_easy,     # NEW
            'attempts_start': r1_easy_att,  # NEW
        }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        # Optional: also store the total to a convenient participant field
        player.participant.R1_score = player.Piece_rate


class Round_1_play(MyBasePage):
    extra_fields = ['Piece_rate','Piece_rate_Attempts'] 
    form_fields = MyBasePage.form_fields + extra_fields
    
    timeout_seconds = C.Round_length
    timer_text = C.Timer_text

    @staticmethod
    def is_displayed(player: Player):
        return player.Allowed == 1

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        # Add or modify variables specific to ExtendedPage
        for _ in ['Piece_rate', 'Piece_rate_Attempts']:
            variables['hidden_fields'].append(_)
        return variables
    @staticmethod
    def js_vars(player: Player):
        return {'field_name': 'Piece_rate',
                'treatment_num': player.participant.Treatment,  # int, e.g. 1..10
                'round_index': 1,
                'mix': None,
                }

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        player.participant.R1_score = player.Piece_rate


class Disallowed1(Page):

    @staticmethod
    def is_displayed(player):
        return player.Allowed == 0 and player.CQ_fail == 0

class Disallowed2(Page):

    @staticmethod
    def is_displayed(player):
        return player.Allowed == 0 and player.CQ_fail == 1

class Redirect(Page):

    @staticmethod
    def is_displayed(player):
        return player.Allowed == 0

    @staticmethod
    def js_vars(player):
        return dict(
            completionlinkscreenout=
            player.subsession.session.config['completionlinkdisallowed']
        )

page_sequence = [Welcome,
                 AI_catch,
                 Aboutyou,
                 Instructions,
                 Round_1_instructions,
                 Comprehension_check_1,
                 Comprehension_check_2,
                 Round_1_begin,
                 Round_1_play_easy,
                 Round_1_play_hard,
                 #Round_1_play,
                 Disallowed1,
                 Disallowed2,
                 Redirect
                 ]