from otree.api import *


doc = '''
Third app - Exit survey.
'''

def get_treatment_part(part, player):
    'returns the part of the treatment that is relevant for the player'
    'i.e. if treatment="T1_Math_men" and part=1, it returns "Math"'
    return player.participant.Treatment.split('_')[part]

class C(BaseConstants):
    NAME_IN_URL = 'Pilot'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    
    Instructions_male_path = "_templates/global/Instructions_male.html"
    Instructions_female_path = "_templates/global/Instructions_female.html"
    Instructions_choice_path = "_templates/global/Instructions_choice.html"
    Instructions_choice_past_path = "_templates/global/Instructions_choice_past.html"
    Instructions_choice_2_path = "_templates/global/Instructions_choice_2.html"
    Task_instructions_path = "_templates/global/Task_instructions.html"
    
    MathMemory_pic = 'https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/MathMemory_pic.png'

        
    Completion_fee = 7.5 
    Piece_rate = 0.10 
    Tournament_rate = 0.60 
    Tournament_rate_2 = 0.20 
    Max_Bonus = 10 


class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass

class Player(BasePlayer):
      
    #Pilot questions
    Pilot_1 = models.StringField(blank= True, label='Are the general instructions clear?')
    Pilot_2 = models.StringField(blank= True, label='Are the instructions for the game clear?')
    Pilot_3 = models.StringField(blank= True, label='Which parts are confusing?')
    Pilot_4 = models.StringField(blank= True, label='Is the experiment boring?')
    Pilot_5 = models.StringField(blank= True, label='What can be improved?')
    Pilot_6 = models.LongStringField(blank= True, label='Further comments')
    Pilot_7 = models.LongStringField(blank= True, label='Your name (in case I want to ask you a question)')
    


#%% Base Pages
class MyBasePage(Page):
    'MyBasePage contains the functions that are common to all pages'
    form_model = 'player'
    form_fields = []

    
    @staticmethod
    def vars_for_template(player: Player):
        if player.participant.Gender == 'Male':
                Instructions_path = C.Instructions_male_path
        else: Instructions_path = C.Instructions_female_path
                        

        return {'hidden_fields': [], #hide the browser field from the participant, see the page to see how this works. #user_clicked_out
                'Instructions_path': Instructions_path,
                'Task_instructions': C.Task_instructions_path,
                'MathMemory': get_treatment_part(1, player),
                'Skill': get_treatment_part(1, player).lower(),
                'SOB': get_treatment_part(2, player),
                'Tournament_rate_cents': int(C.Tournament_rate*100),
                'Piece_rate_cents': int(C.Piece_rate*100),
                } 
  


#%% Pages

# Only for pilot
class Pilot(MyBasePage):
    extra_fields = ['Pilot_1','Pilot_2','Pilot_3','Pilot_4','Pilot_5','Pilot_6', 'Pilot_7']
    form_fields = MyBasePage.form_fields + extra_fields
    
        
page_sequence = [
    Pilot
    ]
