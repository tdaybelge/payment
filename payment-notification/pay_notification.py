from flask import Flask, request, abort, jsonify

app = Flask(__name__)

@app.route('/payments/payment', methods=['POST'])
def payment_notification():
    if not request.json:
        abort(400)
    return jsonify({'result':'OK'}), 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
