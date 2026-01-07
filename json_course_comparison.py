import tkinter as tk
from tkinter import scrolledtext, messagebox, Frame, Label, Button
import json

class JsonComparatorApp:
    """
    A simple UI application to compare two JSON lists of URLs,
    find the intersection, and allow removal of common items.
    """
    def __init__(self, root):
        self.root = root
        self.root.title("JSON List Comparison Intelligence")
        self.root.geometry("900x750")

        # To store the most recently found common URLs
        self.common_urls_set = set()

        # --- Main Layout Frames ---
        top_frame = Frame(root, padx=10, pady=5)
        top_frame.pack(fill=tk.BOTH, expand=True)
        
        middle_frame = Frame(root, padx=10, pady=5)
        middle_frame.pack(fill=tk.X)

        bottom_frame = Frame(root, padx=10, pady=10)
        bottom_frame.pack(fill=tk.BOTH, expand=True)
        
        # --- Widgets for List 1 ---
        list1_frame = Frame(top_frame)
        list1_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))
        Label(list1_frame, text="JSON File 1 Content:", font=("Helvetica", 11, "bold")).pack(anchor="w")
        self.list1_textbox = scrolledtext.ScrolledText(list1_frame, height=15, width=50, wrap=tk.WORD, undo=True)
        self.list1_textbox.pack(fill=tk.BOTH, expand=True)

        # --- Widgets for List 2 ---
        list2_frame = Frame(top_frame)
        list2_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(5, 0))
        Label(list2_frame, text="JSON File 2 Content:", font=("Helvetica", 11, "bold")).pack(anchor="w")
        self.list2_textbox = scrolledtext.ScrolledText(list2_frame, height=15, width=50, wrap=tk.WORD, undo=True)
        self.list2_textbox.pack(fill=tk.BOTH, expand=True)

        # --- Action Buttons ---
        self.find_button = Button(middle_frame, text="Find Overlapping Courses", command=self.find_overlaps, bg="#007BFF", fg="white", font=("Helvetica", 10, "bold"))
        self.find_button.pack(pady=5, fill=tk.X)

        # --- Results and Removal Section ---
        Label(bottom_frame, text="Courses Found in Both Files:", font=("Helvetica", 11, "bold")).pack(anchor="w")
        self.results_textbox = scrolledtext.ScrolledText(bottom_frame, height=10, width=100, wrap=tk.WORD, state=tk.DISABLED)
        self.results_textbox.pack(fill=tk.BOTH, expand=True, pady=(0, 10))

        removal_frame = Frame(bottom_frame)
        removal_frame.pack(fill=tk.X)

        self.remove1_button = Button(removal_frame, text="Remove Overlaps from List 1", command=lambda: self.remove_overlaps(1), state=tk.DISABLED)
        self.remove1_button.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(0, 5))
        
        self.remove2_button = Button(removal_frame, text="Remove Overlaps from List 2", command=lambda: self.remove_overlaps(2), state=tk.DISABLED)
        self.remove2_button.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=(5, 0))
        
        self.clear_button = Button(bottom_frame, text="Clear All Fields", command=self.clear_all, bg="#6c757d", fg="white")
        self.clear_button.pack(pady=(10, 0), fill=tk.X)


    def _parse_json_from_textbox(self, textbox):
        """Helper to safely parse JSON from a textbox."""
        content = textbox.get("1.0", tk.END).strip()
        if not content:
            return []
        try:
            data = json.loads(content)
            if not isinstance(data, list):
                raise ValueError("JSON content is not a list.")
            return data
        except (json.JSONDecodeError, ValueError) as e:
            messagebox.showerror("Invalid JSON", f"Could not parse JSON. Please check the format.\n\nError: {e}")
            return None

    def find_overlaps(self):
        """Finds and displays items common to both lists."""
        list1 = self._parse_json_from_textbox(self.list1_textbox)
        list2 = self._parse_json_from_textbox(self.list2_textbox)

        # Abort if parsing failed
        if list1 is None or list2 is None:
            return

        set1 = set(list1)
        set2 = set(list2)
        
        self.common_urls_set = set1.intersection(set2)
        
        self.results_textbox.config(state=tk.NORMAL)
        self.results_textbox.delete("1.0", tk.END)

        if self.common_urls_set:
            # Sort for consistent display
            common_list_sorted = sorted(list(self.common_urls_set))
            self.results_textbox.insert("1.0", "\n".join(common_list_sorted))
            
            # Enable removal buttons
            self.remove1_button.config(state=tk.NORMAL)
            self.remove2_button.config(state=tk.NORMAL)
            messagebox.showinfo("Success", f"Found {len(self.common_urls_set)} overlapping courses.")
        else:
            self.results_textbox.insert("1.0", "No common courses found.")
            self.remove1_button.config(state=tk.DISABLED)
            self.remove2_button.config(state=tk.DISABLED)

        self.results_textbox.config(state=tk.DISABLED)

    def remove_overlaps(self, list_number):
        """Removes the common URLs from the specified list."""
        if not self.common_urls_set:
            messagebox.showwarning("No Overlaps", "No overlaps to remove. Please run 'Find Overlaps' first.")
            return

        if list_number == 1:
            target_textbox = self.list1_textbox
            list_name = "List 1"
        else:
            target_textbox = self.list2_textbox
            list_name = "List 2"

        original_list = self._parse_json_from_textbox(target_textbox)
        if original_list is None: return # Parsing failed

        # Filter out the common URLs
        updated_list = [url for url in original_list if url not in self.common_urls_set]
        
        # Format back to a pretty JSON string
        updated_json = json.dumps(updated_list, indent=2)

        # Update the textbox
        target_textbox.delete("1.0", tk.END)
        target_textbox.insert("1.0", updated_json)

        messagebox.showinfo("Success", f"Removed {len(self.common_urls_set)} URLs from {list_name}.")

        # Refresh the overlaps, which should now be empty
        self.find_overlaps()

    def clear_all(self):
        """Clears all text fields and resets the state."""
        self.list1_textbox.delete("1.0", tk.END)
        self.list2_textbox.delete("1.0", tk.END)
        
        self.results_textbox.config(state=tk.NORMAL)
        self.results_textbox.delete("1.0", tk.END)
        self.results_textbox.config(state=tk.DISABLED)
        
        self.common_urls_set = set()
        self.remove1_button.config(state=tk.DISABLED)
        self.remove2_button.config(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = JsonComparatorApp(root)
    root.mainloop()
