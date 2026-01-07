import tkinter as tk
from tkinter import scrolledtext, messagebox
import json

# --- Configuration ---
BASE_URL = "https://courseroom.capella.edu/courses/"

def generate_and_display_json():
    """
    Gets numbers from the input box, processes them, 
    and displays the resulting JSON in the output box.
    """
    # Get the raw text from the input box
    input_data = input_textbox.get("1.0", tk.END)
    
    # Split the text into individual numbers, ignoring any blank lines or whitespace
    numbers = [num for num in input_data.strip().splitlines() if num.strip()]
    
    if not numbers:
        messagebox.showwarning("Input Error", "The input box is empty. Please paste some numbers.")
        return
        
    # Create the full URL for each number
    url_list = [f"{BASE_URL}{num.strip()}" for num in numbers]
    
    try:
        # Convert the list of URLs into a nicely formatted JSON string
        json_output = json.dumps(url_list, indent=2)
        
        # Enable the output box to modify it
        output_textbox.config(state=tk.NORMAL)
        # Clear any previous output
        output_textbox.delete("1.0", tk.END)
        # Insert the new JSON
        output_textbox.insert("1.0", json_output)
        # Disable the output box to make it read-only
        output_textbox.config(state=tk.DISABLED)
        
    except Exception as e:
        messagebox.showerror("Error", f"An unexpected error occurred: {e}")

def copy_to_clipboard():
    """Copies the content of the output box to the system clipboard."""
    # Get the content from the output box
    json_output = output_textbox.get("1.0", tk.END).strip()
    if not json_output:
        messagebox.showinfo("Clipboard", "Output box is empty. Nothing to copy.")
        return
        
    # Clear the clipboard and append the new content
    window.clipboard_clear()
    window.clipboard_append(json_output)
    messagebox.showinfo("Clipboard", "JSON output copied to clipboard!")

def clear_fields():
    """Clears both the input and output text boxes."""
    input_textbox.delete("1.0", tk.END)
    output_textbox.config(state=tk.NORMAL)
    output_textbox.delete("1.0", tk.END)
    output_textbox.config(state=tk.DISABLED)

# --- Set up the main window ---
window = tk.Tk()
window.title("URL to JSON Generator")
window.geometry("600x700") # Set a default size

# Create a main frame to hold all the widgets
main_frame = tk.Frame(window, padx=10, pady=10)
main_frame.pack(fill=tk.BOTH, expand=True)

# --- Input Widgets ---
input_label = tk.Label(main_frame, text="Paste your numbers below (one per line):", font=("Helvetica", 10))
input_label.pack(anchor="w")

input_textbox = scrolledtext.ScrolledText(main_frame, height=15, width=70, wrap=tk.WORD)
input_textbox.pack(fill=tk.BOTH, expand=True, pady=(5, 10))

# --- Button Frame ---
button_frame = tk.Frame(main_frame)
button_frame.pack(fill=tk.X, pady=5)

generate_button = tk.Button(button_frame, text="Generate JSON", command=generate_and_display_json, bg="#4CAF50", fg="white", font=("Helvetica", 10, "bold"))
generate_button.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(0, 5))

copy_button = tk.Button(button_frame, text="Copy to Clipboard", command=copy_to_clipboard)
copy_button.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=5)

clear_button = tk.Button(button_frame, text="Clear All", command=clear_fields, bg="#f44336", fg="white")
clear_button.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(5, 0))


# --- Output Widgets ---
output_label = tk.Label(main_frame, text="JSON Output (read-only):", font=("Helvetica", 10))
output_label.pack(anchor="w", pady=(10, 0))

output_textbox = scrolledtext.ScrolledText(main_frame, height=15, width=70, wrap=tk.WORD, state=tk.DISABLED)
output_textbox.pack(fill=tk.BOTH, expand=True, pady=(5, 0))


# --- Start the application's main loop ---
window.mainloop()