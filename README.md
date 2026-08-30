# ✨ Lumiscript - Modern Blogging Platform

Lumiscript is a modern blogging platform built with **Django** that provides a clean and engaging space for users to discover articles, share ideas, publish stories, and interact with content through likes, bookmarks, comments, and more.

---

## Features

### Authentication & Accounts

- User Registration
- User Login & Logout
- Custom User Authentication
- Reader & Author Roles
- Editable User Profile
- Profile Image Upload
- Bio & Personal Website
- Profile Dropdown Navigation
- Active Navigation States
- Toast Notifications

### Article Management

- Create Articles
- Save Articles as Drafts
- Publish Articles
- Edit Articles
- Delete Articles
- Published Article Management
- Draft Article Management
- Featured Image Upload
- Article Excerpts
- Categories
- Tags
- Publication Date
- Article View Count

### Reader Engagement

- Like Articles
- Unlike Articles
- Bookmark Articles
- Remove Bookmarks
- Like Count
- Bookmark Status
- Article View Tracking
- Comment on Articles
- Reply to Comments
- Nested Comment Support
- Personal Bookmark Collection
- Personal Comment History

### Article Discovery

- Explore Published Articles
- Browse Articles by Category
- Browse Articles by Topic
- Search Articles
- Filter Articles
- Featured Article Section
- Latest Articles Section
- Article Cards
- Category-based Discovery

### Profile & Author Dashboard

- User Profile
- Published Articles
- Draft Articles
- Bookmarked Articles
- User Comments
- Article Statistics
- Likes Received
- Create Article
- Edit Article
- Delete Article
- Publish Draft
- Profile Editing

### UI & UX

- Modern Responsive Design
- Fixed Navigation Bar
- Active Navigation Links
- Profile Dropdown
- Responsive Article Cards
- Featured Article Layout
- Image Placeholders
- Bookmark Buttons
- Like Indicators
- Delete Confirmation Modal
- Toast Notifications
- Responsive Forms
- Responsive Mobile Layout
- Footer with Social Links

---

## Technology Stack

- **Backend:** Django
- **API:** Django REST Framework
- **Database:** PostgreSQL
- **Frontend:** HTML5
- **Styling:** CSS3
- **Client-side:** JavaScript
- **Icons:** Boxicons
- **Image Processing:** Pillow
- **Authentication:** Django Custom User Model
- **Database ORM:** Django ORM
- **API Format:** JSON
- **Version Control:** Git & GitHub

---

## Project Structure

```text
Lumiscript/
│
├── accounts/
│   ├── migrations/
│   ├── templates/
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── blog/
│   ├── migrations/
│   ├── templates/
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
|
├── blog/
│
├── templates/
│   ├── base.html
│   ├── accounts/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── profile.html
│   │   └── edit_profile.html
│   │
│   └── blog/
│   |   ├── blog.html
│   |   ├── detail.html
│   |   ├── create_post.html
│   |   └── edit_post.html
│   |
|   └── core/
│       ├── home.html
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── auth.css
│   │   ├── home.css
│   │   ├── blog.css
│   │   ├── profile.css
│   │   ├── create_post.css
│   │   └── ...
│   │
│   └── js/
│       ├── main.js
│       ├── profile.js
│       └── ...
│
├── media/
│   ├── profile_images/
│   ├── post_images/
│   └── screenshots/
│
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

---

## Core Data Models

### User

Lumiscript uses a custom Django user model for account management and authentication.

### Post

The `Post` model represents an article created by an author.

### Category

Categories organize articles into broader topics and allow readers to discover related content.

### Tag

Tags provide additional labels for articles and support topic-based filtering and discovery.

### PostView

Tracks article views and helps maintain article engagement statistics.

### PostLike

Stores article likes and prevents duplicate likes from the same user.

### Bookmark

Allows users to save articles for later reading.

### Comment

Stores article comments and supports nested replies through a parent-comment relationship.

---

## Installation Guide

### 1. Clone Repository

```bash
git clone <your-repository-url>
```

### 2. Go to Project Directory

```bash
cd Lumiscript
```

### 3. Create Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Configuration

Create a `.env` file in the project root.

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=lumiscript
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

---

## PostgreSQL Configuration

Lumiscript uses **PostgreSQL** as its primary database.

Create a database:

```sql
CREATE DATABASE lumiscript;
```

Configure Django to use the PostgreSQL database according to your environment variables.

Example configuration:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": DB_NAME,
        "USER": DB_USER,
        "PASSWORD": DB_PASSWORD,
        "HOST": DB_HOST,
        "PORT": DB_PORT,
    }
}
```

---

## Run Migrations

Create migrations:

```bash
python manage.py makemigrations
```

Apply migrations:

```bash
python manage.py migrate
```

---

## Create Superuser

Create a Django admin account:

```bash
python manage.py createsuperuser
```

Follow the terminal instructions to complete the setup.

---

## Run Development Server

```bash
python manage.py runserver
```

Open your browser:

```text
http://127.0.0.1:8000/
```

---

## Admin Panel

The Django admin panel can be accessed at:

```text
http://127.0.0.1:8000/admin/
```
---
# Functionalities

- ✔ User Registration
- ✔ User Login
- ✔ User Logout
- ✔ Custom User Authentication
- ✔ User Profile
- ✔ Profile Editing
- ✔ Profile Image Upload
- ✔ Bio
- ✔ Personal Website
- ✔ Reader & Author Roles
- ✔ Dashboard
- ✔ Create Article
- ✔ Save Draft
- ✔ Publish Article
- ✔ Edit Article
- ✔ Delete Article
- ✔ Published Articles
- ✔ Draft Articles
- ✔ Featured Images
- ✔ Categories
- ✔ Tags
- ✔ Article Excerpts
- ✔ Article Views
- ✔ Article Likes
- ✔ Like / Unlike
- ✔ Bookmarks
- ✔ Save / Unsave
- ✔ Comments
- ✔ Comment Replies
- ✔ Nested Comments
- ✔ Search
- ✔ Filtering
- ✔ Topics
- ✔ Explore Articles
- ✔ Featured Article
- ✔ Latest Articles
- ✔ Django REST API
- ✔ Pagination
- ✔ Toast Notifications
- ✔ Delete Confirmation Modal
- ✔ Fixed Navigation
- ✔ Active Navigation States
- ✔ Responsive Design
- ✔ Image Placeholders
- ✔ Social Media Footer

---

# Screenshots

---

# Author

**Maksuda Parvin**

Department of Computer Science & Engineering

Bangladesh University of Business and Technology (BUBT)

---

# License

This project is developed for learning, portfolio, and educational purposes.
