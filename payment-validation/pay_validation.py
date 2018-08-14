from flask import Flask, request, abort, jsonify

app = Flask(__name__)

@app.route('/payments/payment', methods=['POST'])
def amount_validation():
    if not request.json:
        abort(400)
    print(request.json)
    amount = int(request.json["amount"])
    if amount < 0:
            abort(400)
    return ('', 204)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002)
