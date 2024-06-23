from flask import Flask, request, jsonify
import subprocess
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

@app.route('/run-script', methods=['POST'])
def run_script():
    try:
        logging.info('Running the Python script...')
        result = subprocess.run(['python', 'implement.py'], capture_output=True, text=True)
        logging.info('Script ran successfully.')
        return jsonify({'output': result.stdout, 'error': result.stderr})
    except Exception as e:
        logging.error(f'Error running script: {str(e)}')
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
