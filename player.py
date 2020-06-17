import random

class PlayerSet:
    def __init__(self, cap = 100):
        self.cap = cap
        self.ids = {}


    def addPlayer(self,id = None):
        if id == -1:
            return

        if id == None:
            id = random.randint(0, self.cap)
            while id in self.ids.keys():
                id = random.randint(0, self.cap)
            self.ids[id] = Player(id)

        else:
            self.ids[id] = Player(id)

        return self.ids[id]

    def reset(self):
        self.ids = {}


    def cur_ids(self):
        return self.ids.keys()


    def print_all(self):
        for k,v in self.ids.items():
            v.print_out()



    def to_dict(self):
        output = {}
        for k,v in self.ids.items():
            output[k] = v.data
        return output
        # return self.ids



    def update_position(self,id, data):
        self.ids[id].data = data

class Player:
    def __init__(self, id, data = {}):
        self.id = id
        self.data = data


    def print_out(self):
        s=""
        for k,v in self.data.items():
            s+="{}: {}, ".format(k, v)
        print(s)
        # print("{}: X: {}, Y: {}".format(self.id, self.x, self.y))
