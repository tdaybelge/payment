from flask import Flask, request, abort, jsonify

app = Flask(__name__)

@app.route('/payments/payment', methods=['PUT'])
def declaration_to_actual():
    if not request.json:
        abort(400)
    print(request.json)
    actual_debit = {
        'acc_no': request.json["declaration"]["debit_ep"]["acc_no"],
        'branch_code': request.json["declaration"]["debit_ep"]["branch_code"],
        'currency_code': request.json["declaration"]["debit_ep"]["currency_code"]
    }
    actual_credit = {
        'acc_no': request.json["declaration"]["credit_ep"]["acc_no"],
        'branch_code': request.json["declaration"]["credit_ep"]["branch_code"],
        'currency_code': request.json["declaration"]["credit_ep"]["currency_code"]
    }
    actual = {'debit_ep':actual_debit, 'credit_ep':actual_credit}
    request.json["actual"] = actual;
    return jsonify(request.json)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
