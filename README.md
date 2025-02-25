# LinkedIn AI Responder

This project is a **LinkedIn AI Responder** built using **TypeScript**. It automatically responds to LinkedIn messages with AI-generated responses, specifically designed to engage with recruiters. If a recruiter attempts to book a meeting or interview, it sends a **WhatsApp message via Twilio** to notify you.

## Features

- Automated responses to LinkedIn messages using AI.
- Integration with **OpenAI** for generating AI-based replies.
- Sends a **WhatsApp notification** using **Twilio** whenever a recruiter tries to book a meeting or interview.
- Built with **TypeScript** for type safety and modern JavaScript features.
- Customizable and easy to set up.

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

## Installation

### 1. Clone the repository 

```bash
git clone https://github.com/your-username/linkedin-ai-responder.git
```

### 2. Install dependencies

```bash
cd linkedin-ai-responder
npm install
```

## Setup

### 1. Adjust the environment variables

Use the file sample.env to fill in the required properties. 

### 2. Enter the LinkedIn credentials 

This setup allows you to enter the LinkedIn credentials so these can be stored in the Google profile directory,
which will be created in the root of the project's folder. You can close the browser once you're done.

```bash
npm run setup
```

## Running

Let the magic happen. The script will search for unread messages and use the configured LLM to generate and send the next
message in the chat conversation. If the recruiter is trying to book an interview/meeting online the script will call
Twilio API and send a message to you.

```bash
npm run start
```

