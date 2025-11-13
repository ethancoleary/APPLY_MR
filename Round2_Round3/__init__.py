from otree.api import *
import random
import numpy as np
import time
from common import *


doc = '''
This is the main survey app. It contains
'''
#%%Functions

#%%

class C(CommonConstants):
    NAME_IN_URL = 'Main_part'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    PIECE_RATE = 0.05
    


    Round_length = 120 #TODO: reduce to 120 seconds
    Min_round_length = Round_length 
    Timer_text = "Time left to complete this round:"  

    Calculator_path = "_templates/global/Calculator.html"
    
    
    Instructions_choice_path = "_templates/global/Instructions_choice.html"
    Instructions_choice_past_path = "_templates/global/Instructions_choice_past.html"
    Instructions_choice_2_path = "_templates/global/Instructions_choice_2.html"

    MathMemory_pic = 'https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/MathMemory_pic.png'

    Belief_Treatment_male = "_templates/global/Belief_treatment_male.html"
    Belief_Treatment_female = "_templates/global/Belief_treatment_female.html" 
    
    
    
    
class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass

class Player(BasePlayer):   
    
    # Timer
    page_pass_time = models.FloatField()
    
    ## Group
    Gender = models.StringField()

    
    # Player answers
    ## Data quality

    
    ## Main
    Round2_Mix = models.IntegerField(
        choices=[
            [1, 'Easy Mix'],
            [2, 'Hard Mix']
        ]
    )
    Round2 = models.IntegerField(initial=0) #correct answers
    Round2_Attempts = models.IntegerField(initial=0, blank=True) # logs the number of attempts in the math memory game
    Round3 = models.IntegerField(initial=0) #correct answers
    Round3_Attempts = models.IntegerField(initial=0, blank=True) # logs the number of attempts in the math memory game
    
    Choice = models.IntegerField(
        choices = [
            [1, 'Payment Rule A'],
            [2, 'Payment Rule B']
        ],
        label='R3 Payment Rule Choice'
    ) #
    
    CQ1 = models.IntegerField(
        choices=[
            [1, 'Mix 1 (sets have mostly easy cards)'],
            [2, 'Mix 2 (sets have mostly hard cards)']
        ],
        label='Mix',
        widget=widgets.RadioSelect
    )
    CQ1_incorrect = models.IntegerField(initial=0)
    CQ1_incorrect2 = models.IntegerField(initial=0)

    CQ2 = models.IntegerField(
        choices=[
            [1, 'Mix 1'],
            [2, 'Mix 2'],
            [3, 'Either Mix 1 or Mix 2 depending on their individual coin flip']
        ],
        label='Mix',
        widget=widgets.RadioSelect
    )
    CQ2_incorrect = models.IntegerField(initial=0)
    CQ2_incorrect2 = models.IntegerField(initial=0)
    cq_page_2 = models.IntegerField(initial=0)

    Comprehension_password = models.StringField(blank=False,
                                                label='Password')

    CQ1_2 = models.IntegerField(
        choices=[
            [1, 'Only easy cards'],
            [2, 'A mix of easy and hard cards'],
            [3, 'Only hard cards']
        ],
        label='CQ12',
        widget=widgets.RadioSelect
    )
    CQ1_2_incorrect = models.IntegerField(initial=0)
    CQ1_2_incorrect2 = models.IntegerField(initial=0)
    CQ2_2 = models.IntegerField(
        choices=[
            [1, 'Choose Payment Rule A'],
            [2, 'Choose Payment Rule B and are not selected by the Hirer'],
            [3, 'Choose Payment Rule B and are not selected by the Hirer']
        ],
        label='CQ22',
        widget=widgets.RadioSelect
    )
    CQ2_2_incorrect = models.IntegerField(initial=0)
    CQ2_2_incorrect2 = models.IntegerField(initial=0)
    CQ3_2 = models.IntegerField(
        choices=[
            [1, 'Choose Payment Rule A'],
            [2, 'Choose Payment Rule B and are not selected by the Hirer'],
            [3, 'Choose Payment Rule B and are not selected by the Hirer']
        ],
        label='CQ32',
        widget=widgets.RadioSelect
    )
    CQ3_2_incorrect = models.IntegerField(initial=0)
    CQ3_2_incorrect2 = models.IntegerField(initial=0)
    CQ4_2 = models.IntegerField(
        choices=[
            [1, 'The Round 2 score of their selected participant'],
            [2, 'The Round 1 score of their selected participant'],
            [3, 'The Round 3 score of their selected participant']
        ],
        label='CQ42',
        widget=widgets.RadioSelect
    )
    CQ4_2_incorrect = models.IntegerField(initial=0)
    CQ4_2_incorrect2 = models.IntegerField(initial=0)
    CQ5_2 = models.IntegerField(
        choices=[
            [1, 'Whether they select the same participant as the Manger'],
            [2, 'The Round 2 score of their selected participant'],
            [3, 'The Round 3 score of their selected participant']
        ],
        label='CQ52',
        widget=widgets.RadioSelect
    )
    CQ5_2_incorrect = models.IntegerField(initial=0)
    CQ5_2_incorrect2 = models.IntegerField(initial=0)
    CQ6_2 = models.IntegerField(
        choices=[
            [1, 'TRUE'],
            [2, 'FALSE'],
        ],
        label='CQ62',
        widget=widgets.RadioSelect
    )
    CQ6_2_incorrect = models.IntegerField(initial=0)
    CQ6_2_incorrect2 = models.IntegerField(initial=0)

    CQ7_2 = models.IntegerField(
        choices=[
            [1, 'Only your Round 2 score'],
            [2, 'Only the Round 2 scores all participants in your group'],
            [3, 'The Round 2 scores and avatars of all participants in your group']
        ],
        label='CQ72',
        widget=widgets.RadioSelect
    )
    CQ7_2_incorrect = models.IntegerField(initial=0)
    CQ7_2_incorrect2 = models.IntegerField(initial=0)
    cq2_page_2 = models.IntegerField(initial=0)


    #clicked info
    clicked_info = models.StringField(initial=False)
    # Choice stage choices
    Calculator = models.StringField(min=0, max=100, blank=True, label='Calculator',)
    Competitiveness_1 = models.IntegerField(min=0, max=100, blank=True)
    Competitiveness_1_list = models.StringField(blank=True)
    
    Competitiveness_binary = models.BooleanField(
        label='Do you want to apply Tournament-rate or Piece-rate to your Round 1 score?',
        choices=[
            [True, 'Tournament-rate ($0.60 per point if best performer)'],
            [False, 'Piece-rate ($0.10 per point guaranteed)'],
        ],
        widget=widgets.RadioSelect,
        blank=False,)
    
    # data quality
    blur_log = models.LongStringField(blank=True)
    blur_count = models.IntegerField(initial=0, blank=True)
    blur_warned = models.IntegerField(initial=0, blank=True)

 
 #%% Base Pages
# class MyBasePage(MyBasePageCommon):
   
#     @staticmethod
#     def vars_for_template(player: Player):
#         variables = MyBasePage.vars_for_template(player)

#         if player.participant.Gender == 'Male':
#                 Instructions_path = C.Instructions_male_path
#         else: Instructions_path = C.Instructions_female_path        
        
#         variables['Instructions_path'] = Instructions_path
#         variables['Task_instructions'] = C.Task_instructions_path
#         variables['MathMemory'] = get_treatment_part(1, player)
#         variables['Skill'] = get_treatment_part(1, player)
#         variables['MathMemory'] = get_treatment_part(1, player).lower()
#         variables['SOB'] = get_treatment_part(2, player)
        
#         variables['Tournament_rate_cents'] = int(C.Tournament_rate*100)
#         variables['Piece_rate_cents'] = int(C.Piece_rate*100)

        
        
#         return variables
        
  
#%% Pages




'R2: Tournament stage'
class Round_2_instructions(MyBasePage):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.page_pass_time = time.time() + C.Min_round_length

        mix_draw = random.randint(1,2 )
        player.Round2_Mix = mix_draw
        player.participant.R2_mix = mix_draw
        
class Round_2_play_MixA(MyBasePage):
    extra_fields = ['Round2','Round2_Attempts']
    form_fields = MyBasePage.form_fields + extra_fields
    
    timeout_seconds = C.Round_length
    timer_text = C.Timer_text

    @staticmethod
    def is_displayed(player: Player):
        return player.Round2_Mix == 1
    
    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        # Add or modify variables specific to ExtendedPage
        for _ in ['Round2', 'Round2_Attempts']:
            variables['hidden_fields'].append(_)
        return variables
    @staticmethod
    def js_vars(player: Player):
        return {'field_name': 'Round2',
                'treatment_num': player.participant.Treatment,  # int
                'round_index': 2,
                'mix': 'mix1',}

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        player.participant.R2_score = player.Round2


class Round_2_play_MixB(MyBasePage):
    extra_fields = ['Round2', 'Round2_Attempts']
    form_fields = MyBasePage.form_fields + extra_fields

    timeout_seconds = C.Round_length
    timer_text = C.Timer_text

    @staticmethod
    def is_displayed(player: Player):
        return player.Round2_Mix == 2

    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        # Add or modify variables specific to ExtendedPage
        for _ in ['Round2', 'Round2_Attempts']:
            variables['hidden_fields'].append(_)
        return variables

    @staticmethod
    def js_vars(player: Player):
        return {'field_name': 'Round2', 
                'treatment_num': player.participant.Treatment,
                'round_index': 2,
                'mix': 'mix2',}

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        player.participant.R2_score = player.Round2


class Round_2_comprehension(MyBasePage):
    extra_fields = ['CQ1', 'CQ2']
    form_fields = MyBasePage.form_fields + extra_fields


    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        if player.CQ1 != player.Round2_Mix:
            player.CQ1_incorrect = 1
            player.CQ1 = 0
        if player.CQ2 != 3:
            player.CQ2_incorrect = 1
            player.CQ2 = 0

        incorrect_index = player.CQ1_incorrect + player.CQ2_incorrect
        if incorrect_index > 0:
            player.cq_page_2 = 1
class Round_2_comprehension2(MyBasePage):
    extra_fields = ['CQ1', 'CQ2']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def is_displayed(player: Player):
        return player.cq_page_2 == 1

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        if player.CQ1 != player.Round2_Mix:
            player.CQ1_incorrect2 = 1
        if player.CQ2 != 3:
            player.CQ2_incorrect2 = 1


# pages.py (or wherever the page class lives)

class Round_3_instructions(MyBasePage):

    @staticmethod
    def vars_for_template(player):
        ctx = MyBasePage.vars_for_template(player)
        t = player.participant.Treatment

        # ==== Defaults: single Manager, neutral ====
        show_recruiter = False
        manager_gender = ''          # -> prints nothing before "person"
        recruiter_gender = ''        # not shown unless show_recruiter = True
        manager_avatar = 'graphics/Manager_avatar_neutral.png'
        recruiter_avatar = 'graphics/Recruiter_avatar_neutral.png'

        # ==== Manager-only gender/avatar overrides (future-ready) ====
        if t in (6, 14):
            manager_gender = 'male'
            manager_avatar = 'graphics/Manager_avatar_male.png'
        elif t in (7, 15):
            manager_gender = 'female'
            manager_avatar = 'graphics/Manager_avatar_female.png'

        # ==== Manager + Recruiter (treatment 4 now, 12 future) ====
        if t in (4, 12):
            show_recruiter = True
            # Per your spec: currently both male, but keep them variable for future flips.
            manager_gender = 'male'
            recruiter_gender = 'male'
            manager_avatar = 'graphics/Manager_avatar_male.png'
            recruiter_avatar = 'graphics/Recruiter_avatar_male.png'

        # ==== Manager-view image logic ====
        if t in (1, 8, 9, 16):
            manager_view_img = 'graphics/Manager_view_neutral.png'
        else:
            manager_view_img = 'graphics/Manager_view_reveal.png'


        # Helper: add trailing space only when there is a gender word
        def gender_word(g):
            return (g + ' ') if g else ''

        # Payments used in the text (fallbacks if not set in constants)
        manager_per_point = getattr(CommonConstants, 'Manager_per_point', 0.03)          # £ per point
        recruiter_match_bonus = getattr(CommonConstants, 'Recruiter_match_bonus', 1.00)  # £ if match

        # Determine who is decisive for the worker payoff
        selector_role = "Recruiter" if show_recruiter else "Manager"

        ctx.update({
            # visibility
            'show_recruiter': show_recruiter,

            # words (include trailing space if present)
            'manager_gender_word': gender_word(manager_gender),
            'recruiter_gender_word': gender_word(recruiter_gender),

            # avatars
            'manager_avatar': manager_avatar,
            'recruiter_avatar': recruiter_avatar,

            # money (format for display)
            'manager_per_point': f'{manager_per_point:.2f}',
            'recruiter_match_bonus': f'{recruiter_match_bonus:.2f}',

            # Who hires
            "selector_role": selector_role,

            # What does the decision maker see
            'manager_view_img': manager_view_img,
        })
        return ctx




class Round_3_comprehension_M1(MyBasePage):
    extra_fields = ['CQ1_2', 'CQ2_2', 'CQ3_2', 'CQ4_2', 'CQ7_2']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def is_displayed(player: Player):
        # Manager-only branch
        return player.participant.Treatment not in CommonConstants.Recruiter_Treatments

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        if player.CQ1_2 != 3: player.CQ1_2_incorrect = 1; player.CQ1_2 = 0
        if player.CQ2_2 != 1: player.CQ2_2_incorrect = 1; player.CQ2_2 = 0
        if player.CQ3_2 != 2: player.CQ3_2_incorrect = 1; player.CQ3_2 = 0
        if player.CQ4_2 != 3: player.CQ4_2_incorrect = 1; player.CQ4_2 = 0
        if player.CQ7_2 != 3: player.CQ7_2_incorrect = 1; player.CQ7_2 = 0

        incorrect_index = (
            player.CQ1_2_incorrect + player.CQ2_2_incorrect + player.CQ3_2_incorrect +
            player.CQ4_2_incorrect + player.CQ7_2_incorrect
        )
        if incorrect_index > 0:
            player.cq2_page_2 = 1


class Round_3_comprehension_M1_2(MyBasePage):
    extra_fields = ['CQ1_2', 'CQ2_2', 'CQ3_2', 'CQ4_2', 'CQ7_2']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def is_displayed(player: Player):
        # Second attempt for manager-only branch
        return (
            player.participant.Treatment not in CommonConstants.Recruiter_Treatments and
            player.cq2_page_2 == 1
        )

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        if player.CQ1_2 != 3: player.CQ1_2_incorrect2 = 1
        if player.CQ2_2 != 1: player.CQ2_2_incorrect2 = 1
        if player.CQ3_2 != 2: player.CQ3_2_incorrect2 = 1
        if player.CQ4_2 != 3: player.CQ4_2_incorrect2 = 1
        if player.CQ7_2 != 3: player.CQ7_2_incorrect2 = 1


class Round_3_comprehension_R1(MyBasePage):
    extra_fields = ['CQ1_2', 'CQ2_2', 'CQ3_2', 'CQ4_2', 'CQ5_2', 'CQ6_2', 'CQ7_2']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def is_displayed(player: Player):
        # Recruiter branch
        return player.participant.Treatment in CommonConstants.Recruiter_Treatments

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        if player.CQ1_2 != 3: player.CQ1_2_incorrect = 1; player.CQ1_2 = 0
        if player.CQ2_2 != 1: player.CQ2_2_incorrect = 1; player.CQ2_2 = 0
        if player.CQ3_2 != 2: player.CQ3_2_incorrect = 1; player.CQ3_2 = 0
        if player.CQ4_2 != 3: player.CQ4_2_incorrect = 1; player.CQ4_2 = 0
        if player.CQ5_2 != 1: player.CQ5_2_incorrect = 1; player.CQ5_2 = 0
        if player.CQ6_2 != 2: player.CQ6_2_incorrect = 1; player.CQ6_2 = 0   
        if player.CQ7_2 != 3: player.CQ7_2_incorrect = 1; player.CQ7_2 = 0

        incorrect_index = (
            player.CQ1_2_incorrect + player.CQ2_2_incorrect + player.CQ3_2_incorrect +
            player.CQ4_2_incorrect + player.CQ5_2_incorrect + player.CQ6_2_incorrect +
            player.CQ7_2_incorrect
        )
        if incorrect_index > 0:
            player.cq2_page_2 = 1


class Round_3_comprehension_R1_2(MyBasePage):
    extra_fields = ['CQ1_2', 'CQ2_2', 'CQ3_2', 'CQ4_2', 'CQ5_2', 'CQ6_2', 'CQ7_2']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def is_displayed(player: Player):
        # Second attempt for recruiter branch
        return (
            player.participant.Treatment in CommonConstants.Recruiter_Treatments and
            player.cq2_page_2 == 1
        )

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        if player.CQ1_2 != 3: player.CQ1_2_incorrect2 = 1
        if player.CQ2_2 != 1: player.CQ2_2_incorrect2 = 1
        if player.CQ3_2 != 2: player.CQ3_2_incorrect2 = 1
        if player.CQ4_2 != 3: player.CQ4_2_incorrect2 = 1
        if player.CQ5_2 != 1: player.CQ5_2_incorrect2 = 1
        if player.CQ6_2 != 2: player.CQ6_2_incorrect2 = 1   
        if player.CQ7_2 != 3: player.CQ7_2_incorrect2 = 1



class Round_3_choice(MyBasePage):
    extra_fields = ['Choice']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def vars_for_template(player):
        ctx = MyBasePage.vars_for_template(player)
        t = player.participant.Treatment

        # Is there a Recruiter in this treatment?
        show_recruiter = t in CommonConstants.Recruiter_Treatments

        # Who determines Payment Rule B?
        selector_role = "Recruiter" if show_recruiter else "Manager"

        ctx.update({
            "selector_role": selector_role,
        })
        return ctx

   # @staticmethod
    #def is_displayed(player):
     #   return player.Allowed == 1  # or your condition

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        player.participant.Choice = player.Choice

class Round_3_play(MyBasePage):
    extra_fields = ['Round3','Round3_Attempts']
    form_fields = MyBasePage.form_fields + extra_fields
    
    timeout_seconds = C.Round_length
    timer_text = C.Timer_text
    
    @staticmethod
    def vars_for_template(player: Player):
        variables = MyBasePage.vars_for_template(player)

        # Add or modify variables specific to ExtendedPage
        for _ in ['Round3', 'Round3_Attempts']:
            variables['hidden_fields'].append(_)
        return variables
        
    @staticmethod
    def js_vars(player: Player):
        return {'field_name': 'Round3',
                'treatment_num': player.participant.Treatment,
                'round_index': 3,
                'mix': None,}

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)
        player.participant.R3_score = player.Round3




page_sequence = [
    Round_2_instructions,
    Round_2_play_MixA,
    Round_2_play_MixB,
    Round_2_comprehension,
    Round_2_comprehension2,
    Round_3_instructions,
    Round_3_comprehension_M1,
    Round_3_comprehension_M1_2,
    Round_3_comprehension_R1,
    Round_3_comprehension_R1_2,
    Round_3_choice,
    Round_3_play
    ]
