# 📘 My Todo App

A simple todo application built with Next.js.

---

🌐 **Live Demo:** <a href="http://18.141.189.86:3000/" target="_blank" rel="noopener noreferrer">Click Here to View the App!</a>

---

## 🚀 Features

* **Complete Todo List with Next.js**: A fully functional todo list implemented using Next.js.
* **Input Field & List Elements**: Includes an input field for adding new todos and a list to display them.
* **Add Todo on Enter**: New items are added to the list by typing text in the input field and hitting the Enter key.
* **Minimal UI**: Sticks to the browser's default styling for a clean, straightforward interface.
* **React Hooks**: Extensive use of React hooks for state management and side effects.

### Building More Functionalities:

* **Valid Todo List**: Prevents adding empty items to the list.
* **Unique Todo List**: Ensures no duplicate items are added. Users are warned if they attempt to add a duplicate.
* **Removable Todo List**:
    * A "remove" button appears when hovering over a todo item.
    * Items can be removed from the list by clicking the "remove" button.
* **Editable Todo List**:
    * An "edit" button appears when hovering over a todo item.
    * Clicking "edit" populates the main input field with the item's text, allowing users to edit and update the item by hitting Enter again.
* **Filter Todo List**:
    * As the user types in the input bar, the list filters dynamically based on simple text matching.
    * If no results match the filter, a "No result. Create a new one instead!" message is displayed.
* **Mark as Complete**:
    * "Mark as Complete"/"Mark as Incomplete" buttons appear on hover.
    * Completed todos are displayed with strikethrough text.

---

## 📦 Prerequisites

Before you start, make sure you have **Node.js installed on your machine (version 18 or higher)**.

You can quickly check your Node.js version by running:

```bash
node -v
```

🚚 Getting Started
Follow these steps to get the "My Todo App" up and running on your local machine.

1. Clone the Repository
First, open your terminal or command prompt and clone the project:

Bash

git clone [https://github.com/Sujuforny/my-todo-app.git](https://github.com/Sujuforny/my-todo-app.git)
cd my-todo-app
2. Install Dependencies
Once you're in the project directory, install all the necessary npm packages:

```Bash
npm install
```

3. Run the Development Server
To launch the application in development mode, use the following command:

```Bash
npm run dev
```

This will start the Next.js development server, usually accessible at http://localhost:3000. The app will automatically reload in your browser as you make changes to the code.

⚙️ Building for Production
When you're ready to deploy your application, you can create an optimized production build:


```Bash
npm run build
```

This command compiles and optimizes your Next.js application for the best performance in a production environment.

After building, you can serve the optimized production version locally with:

```Bash
npm run start
```

📚 Learn More
To delve deeper into Next.js and understand how this application works, check out the official documentation:

Next.js Documentation