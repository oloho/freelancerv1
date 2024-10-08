import os
import sys
import time
import subprocess
import requests
import socket
import logging
import socketio
import json
import pyautogui
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Setup logging
logging.basicConfig(filename='slave_pc.log', level=logging.INFO, 
                    format='%(asctime)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S')

# Configuration
SERVER_URL = "http://localhost:3000"  # Replace with your actual server URL
CHECK_INTERVAL = 300  # 5 minutes
REBOOT_COMMAND = "shutdown /r /t 0"
ANTY_PATH = r"C:\Program Files\Anty\Anty.exe"  # Update this path as needed

sio = socketio.Client()

def get_pc_id():
    return f"PC-{socket.gethostname()}"

@sio.event
def connect():
    logging.info("Connected to server")
    sio.emit('register', {'id': get_pc_id(), 'name': socket.gethostname()})

@sio.event
def disconnect():
    logging.info("Disconnected from server")

@sio.on('update')
def on_update():
    logging.info("Received update command")
    perform_update()

@sio.on('reboot')
def on_reboot():
    logging.info("Received reboot command")
    reboot()

@sio.on('newTask')
def on_new_task(data):
    logging.info(f"Received new task: {data}")
    execute_task(data['task'])

def check_internet():
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=5)
        return True
    except OSError:
        return False

def perform_update():
    logging.info("Performing update...")
    # Implement your update logic here
    logging.info("Update completed")

def reboot():
    logging.info("Rebooting system...")
    subprocess.run(REBOOT_COMMAND, shell=True)

def execute_task(task):
    logging.info(f"Executing task: {task}")
    if task == 'create_gmail':
        create_gmail()
    else:
        logging.warning(f"Unknown task: {task}")

def create_gmail():
    logging.info("Starting Gmail creation task")
    try:
        # Open Anty.exe
        subprocess.Popen(ANTY_PATH)
        time.sleep(5)  # Wait for Anty to open

        # Check for updates
        if check_for_anty_updates():
            perform_anty_update()

        # Launch Anty profile
        launch_anty_profile()

        # Start Gmail creation process
        start_gmail_creation()

        logging.info("Gmail creation task completed")
    except Exception as e:
        logging.error(f"Error during Gmail creation: {str(e)}")

def check_for_anty_updates():
    # Use PyAutoGUI to check for update button or notification
    update_button = pyautogui.locateOnScreen('update_button.png', confidence=0.9)
    return update_button is not None

def perform_anty_update():
    logging.info("Performing Anty update")
    update_button = pyautogui.locateOnScreen('update_button.png', confidence=0.9)
    if update_button:
        pyautogui.click(update_button)
        time.sleep(60)  # Wait for update to complete, adjust as needed

def launch_anty_profile():
    # Use Anty API to launch a profile
    # This is a placeholder - replace with actual Anty API call
    logging.info("Launching Anty profile")
    # anty_api.launch_profile(profile_id)

def start_gmail_creation():
    # Implement the steps to create a Gmail account
    # This will involve multiple PyAutoGUI actions
    logging.info("Starting Gmail creation process")
    # Example steps (you'll need to implement the details):
    # 1. Navigate to Gmail signup page
    # 2. Fill in the form fields
    # 3. Solve any CAPTCHAs (this might require additional libraries or services)
    # 4. Complete the signup process
    # 5. Verify the email if necessary

if __name__ == "__main__":
    sio.connect(SERVER_URL)

    connection_loss_time = None

    try:
        while True:
            if check_internet():
                if connection_loss_time:
                    connection_loss_time = None
                    logging.info("Internet connection restored")
                if not sio.connected:
                    sio.connect(SERVER_URL)
            else:
                logging.warning("Internet connection lost")
                if connection_loss_time is None:
                    connection_loss_time = time.time()
                elif time.time() - connection_loss_time > 300:  # 5 minutes
                    logging.error("Internet connection lost for 5 minutes. Rebooting...")
                    reboot()
            
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        sio.disconnect()