from otree.api import *
import random
import numpy as np
import time
from common import *

doc = '''
This is the main survey app. It contains
'''


# %%Functions

# %%

class C(CommonConstants):
    NAME_IN_URL = 'Main_part'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    PIECE_RATE = 0.05

    Round_length = 120  # TODO: reduce to 120 seconds
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

    Selection1 = models.IntegerField()
    Selection2 = models.IntegerField()
    Selection3 = models.IntegerField()
    Selection4 = models.IntegerField()
    Selection5 = models.IntegerField()
    bonus = models.IntegerField()

    Round2 = models.IntegerField(initial=0)  # correct answers
    Round2_Attempts = models.IntegerField(initial=0, blank=True)  # logs the number of attempts in the math memory game
    Round3 = models.IntegerField(initial=0)  # correct answers
    Round3_Attempts = models.IntegerField(initial=0, blank=True)  # logs the number of attempts in the math memory game

    Choice = models.IntegerField(
        choices=[
            [1, 'Payment Rule A'],
            [2, 'Payment Rule B']
        ],
        label='R3 Payment Rule Choice'
    )  #

    CQ1 = models.IntegerField(
        choices=[
            [1, '0 %'],
            [2, '50 %'],
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




    # clicked info
    clicked_info = models.StringField(initial=False)
    # Choice stage choices
    Calculator = models.StringField(min=0, max=100, blank=True, label='Calculator' )


    # data quality
    blur_log = models.LongStringField(blank=True)
    blur_count = models.IntegerField(initial=0, blank=True)
    blur_warned = models.IntegerField(initial=0, blank=True)



# %% Base Pages
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


# %% Pages


'R2: Tournament stage'


class Selections_instructions(MyBasePage):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.page_pass_time = time.time() + C.Min_round_length

        mix_draw = random.randint(1, 2)
        player.Round2_Mix = mix_draw
        player.participant.R2_mix = mix_draw

        player.incentivised_selection = random.randint(1,5)
        player.participant.incentivsised_selection = player.incentivised_selection


class Comprehension_Qs(MyBasePage):
    extra_fields = ['CQ1', 'CQ2', 'CQ3', 'CQ4']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        MyBasePage.before_next_page(player, timeout_happened)

        if player.CQ1 != 2:
            player.CQ1_incorrect = 1
            player.CQ1 = 0
        if player.participant.treatment < 8:
            if player.CQ2 != 1:
                player.CQ2_incorrect = 1
                player.CQ2 = 0
        else:
            if player.CQ2 != 3:
                player.CQ2_incorrect = 1
                player.CQ2 = 0
        etc

        incorrect_index = (player.CQ1_incorrect + player.CQ2_incorrect +
                           player.CQ3_incorrect + player.CQ4_incorrect)
        if incorrect_index > 0:
            player.cq_page_2 = 1

class Comprehension_Qs2(MyBasePage):
    extra_fields = ['CQ1', 'CQ2', 'CQ3', 'CQ4']
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

class Selection1(MyBasePage):
    extra_fields = ['Selection1']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        if player.incentivised_selection == 1:
            if player.Selection1 == 4:
                player.bonus = 1

class Selection2(MyBasePage):
    extra_fields = ['Selection2']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        if player.incentivised_selection == 2:
            player.bonus = 0

class Selection3(MyBasePage):
    extra_fields = ['Selection3']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        if player.incentivised_selection == 3:
            player.bonus = 0

class Selection4(MyBasePage):
    extra_fields = ['Selection4']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        if player.incentivised_selection == 4:
            player.bonus = 0

class Selection5(MyBasePage):
    extra_fields = ['Selection5']
    form_fields = MyBasePage.form_fields + extra_fields

    @staticmethod
    def before_next_page(player: Player, timeout_happened=False):
        if player.incentivised_selection == 5:
            player.bonus = 0


page_sequence = [
    Selections_instructions,
    Comprehension_Qs,
    Comprehension_Qs2,
    Selection1,
    Selection2,
    Selection3,
    Selection4,
    Selection5
]
