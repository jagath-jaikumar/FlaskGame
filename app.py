from flask import Flask, render_template
from flask_socketio import SocketIO

from flask_socketio import send, emit

from player import PlayerSet, Player


app = Flask("sample app")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

players = PlayerSet()

@app.route("/")
def index():
    print("/GET '/' route success 200")
    return render_template("game/game.html")



@socketio.on('connect_request')
def handle_connect_request(json):
    print('received message: ' + str(json))
    id = players.addPlayer().id
    print(players.cur_ids())
    emit('id', {'id':id})

@socketio.on('disconnect')
def test_disconnect():
    emit('check_heartbeat', {}, broadcast=True)
    players.reset()
    print("disconnected")

@socketio.on('check_heartbeat')
def test_disconnect(data):
    id = data['data']
    players.addPlayer(id)
    print(players.cur_ids())


@socketio.on('update_position')
def update_position(data):
    id = data['id']
    players.update_position(id, data)

    players.print_all()
    emit('redraw', players.to_dict(), broadcast=True)



if __name__=="__main__":
    socketio.run(app)
