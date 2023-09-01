# LearnBetter

## Pre-requisites
      1. Python
      2. MongoDB
      3. Postman
      4. Node JS
      5. NPM

## Quick Start

### Creating virtual environment and installing python dependecies

#### 1. Navigate to project folder
    cd recommendation_backend
        
#### 2. Creating virtual environment
    python3 -m venv .venv

#### 3. Activate virtual environment
    # For linux/Macos systems
      source .env/bin/activate

    # For windows systems
      # From command prompt
        .env\bin\activate.bat

      # From power shell
        .env\Scripts\Activate.ps1
  
#### 4. Install python dependencies
    pip3 install -r requirements.txt


#### 5. Populate Database
###### 1. Locate the file populate.py
###### 2. Run the following command
    python3 populate.py <excel_file_location>

#### 6. Run the django project
###### 1. Make sure you are in the root directory of the backend project(where you locate manage.py)
###### 2. Run the following command
    python3 manage.py runserver

#### 7. Run the Frontend application
      cd recommendation_frontend
      npm install
      npm start

## APIs available
### 1. Filtering articles
###### 1. Open the Postman application and set the method type as "POST"
###### 2. Enter the following url in the URL field
    http://127.0.0.1:8000/filter_results/
###### 3. Form_data takes one field currently
    Key : search_term
    Value : <desired search term>
#### Demo setup
![Screenshot from 2023-08-23 22-35-54](https://github.com/srikar58/LearnBetter/assets/61014960/ab76b90d-931a-4a5c-b011-866113c9f586)

      
