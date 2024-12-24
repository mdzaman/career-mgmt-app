# Local Development Environment Setup Guide

## Prerequisites Installation

1. **Install Git**
   - Download from: https://git-scm.com/downloads
   - After installation, verify by opening terminal/command prompt:
   ```bash
   git --version
   ```

2. **Install Visual Studio Code**
   - Download from: https://code.visualstudio.com/
   - Install recommended extensions:
     - Python
     - React
     - Flutter
     - ESLint
     - Prettier

3. **Install Python**
   - Download Python 3.11+ from: https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"
   - Verify installation:
   ```bash
   python --version
   pip --version
   ```

4. **Install Node.js**
   - Download LTS version from: https://nodejs.org/
   - Verify installation:
   ```bash
   node --version
   npm --version
   ```

5. **Install Flutter**
   - Follow official guide: https://docs.flutter.dev/get-started/install
   - Verify installation:
   ```bash
   flutter doctor
   ```

## Project Setup

1. **Create Project Directory**
   ```bash
   mkdir career-platform
   cd career-platform
   ```

2. **Initialize Backend (Python/Flask)**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate

   # Install required packages
   pip install flask flask-sqlalchemy flask-cors python-dotenv pytest

   # Create basic structure
   mkdir backend
   cd backend
   ```

3. **Create Basic Backend Structure**
   ```bash
   mkdir src tests
   touch src/__init__.py
   touch src/app.py
   touch .env
   touch requirements.txt
   ```

4. **Initialize Frontend (React)**
   ```bash
   # In the project root
   npx create-react-app frontend
   cd frontend
   npm install @mui/material @emotion/react @emotion/styled axios react-router-dom
   ```

5. **Initialize Mobile App (Flutter)**
   ```bash
   # In the project root
   flutter create mobile_app
   ```

## Basic Configuration Files

1. **Backend Flask Configuration (src/app.py)**
   ```python
   from flask import Flask
   from flask_cors import CORS
   
   app = Flask(__name__)
   CORS(app)
   
   @app.route('/api/health')
   def health_check():
       return {'status': 'healthy'}
   
   if __name__ == '__main__':
       app.run(debug=True)
   ```

2. **Frontend Basic Setup**
   Update frontend/src/App.js:
   ```javascript
   import React from 'react';
   import { BrowserRouter as Router } from 'react-router-dom';
   
   function App() {
     return (
       <Router>
         <div className="App">
           <h1>Career Management Platform</h1>
         </div>
       </Router>
     );
   }
   
   export default App;
   ```

3. **Mobile App Basic Setup**
   Update mobile_app/lib/main.dart:
   ```dart
   import 'package:flutter/material.dart';
   
   void main() {
     runApp(MyApp());
   }
   
   class MyApp extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         title: 'Career Platform',
         theme: ThemeData(
           primarySwatch: Colors.blue,
         ),
         home: MyHomePage(title: 'Career Platform Home'),
       );
     }
   }
   ```

## Running the Application

1. **Start Backend**
   ```bash
   # In backend directory
   flask run
   ```

2. **Start Frontend**
   ```bash
   # In frontend directory
   npm start
   ```

3. **Start Mobile App**
   ```bash
   # In mobile_app directory
   flutter run
   ```

## Next Steps

1. Set up PostgreSQL database locally
2. Implement basic user authentication
3. Create initial API endpoints
4. Design and implement basic UI components
5. Set up testing framework
6. Configure ESLint and Prettier
7. Set up basic CI/CD pipeline

## Development Best Practices

1. Always work in feature branches
2. Write tests for new features
3. Follow coding standards for each language
4. Regular commits with meaningful messages
5. Document API endpoints and major functions
6. Regular code reviews
7. Keep dependencies updated

## Common Issues and Solutions

1. **Port Conflicts**
   - Backend runs on port 5000
   - Frontend runs on port 3000
   - Adjust if needed in respective configuration files

2. **Virtual Environment Issues**
   - Always ensure virtual environment is activated
   - Check Python path if commands not found

3. **Node Modules Issues**
   - Run `npm install` if modules are missing
   - Clear cache with `npm cache clean --force` if needed

4. **Flutter Issues**
   - Run `flutter doctor` to diagnose problems
   - Ensure Android Studio/Xcode is properly configured
