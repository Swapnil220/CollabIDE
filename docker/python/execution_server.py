from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/execute', methods=['POST'])
def execute():
    code = request.json.get('code', '')
    
    try:
        process = subprocess.run(
            ['python', '-c', code],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        return jsonify({
            'success': True,
            'output': process.stdout or process.stderr
        })
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'output': 'Execution timed out'
        }), 408
    except Exception as e:
        return jsonify({
            'success': False,
            'output': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)