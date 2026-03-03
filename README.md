# AlbomZL - Modern Album

This folder contains the modernized, redesigned version of the "Great People Album" (Альбом замечательных людей). It was created as a sleek, dynamic alternative to the original design, incorporating modern web development and UI/UX best practices.

## Overview

The "AlbomZL Modern Album" is a single-page web application that allows you to collect and document stories about great people. It runs entirely in your browser using LocalStorage to save your data automatically without needing a backend server. 

## Key Features

1. **Modern Glassmorphism Design:**
   - Deep dark theme with glowing accent colors (`#58a6ff` light blue and purple gradients).
   - Translucent, frosted-glass panels (`backdrop-filter: blur`) for the header and cards.
   - Smooth hover animations and scaling effects for interactive elements.

2. **Responsive Grid Layout:**
   - Uses CSS Grid (`grid-template-columns: repeat(auto-fill, ...)`), meaning the cards automatically transition from a single column on mobile to multiple columns on desktop.
   - Flexbox is used for alignment and spacing within the interface.

3. **In-line Editing (WYSIWYG):**
   - Click directly on your **Name** or your **"About Me"** section at the top of the page to edit them (`contenteditable="true"`). The changes are saved immediately when you type.
   - Click on your **Profile Picture** to dynamically upload and replace it.

4. **Dynamic Cards:**
   - Click the **"Add Person"** button to instantly generate a new card.
   - Each card contains:
     - A clickable placeholder image to upload a photo.
     - A title input to type their name.
     - An auto-resizing text area to write their story.
     - Move Up/Down controls to reorganise the list.
     - A Delete button to remove them.

5. **Data Persistence & Export:**
   - Everything you type or upload is saved to your browser's local memory (`localStorage`). If you refresh or close the page, your data remains.
   - **Export Feature:** By clicking "Export Album", the script bundles your data, images, CSS, and HTML into a single `.html` file. You can send this file to a friend, and they can open it in their browser exactly as you left it.

## File Structure

- `template.html` - The structural backbone. Uses semantic HTML (`<header>`, `<main>`, etc.) and links the styles and icons.
- `styles.css` - Contains all visual rules, color variables, animations, and responsive breakpoints.
- `script.js` - The logic handler. It manages file uploads (using `FileReader` to convert images to base64 strings), creates elements dynamically on the DOM, listens to user inputs, and handles the local storage syncing.

## How to view
Simply open `template.html` in any modern web browser. No server setup is required.
