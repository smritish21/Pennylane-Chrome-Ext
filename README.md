# QuantumTutor – PennyLane Chrome Extension (Prolific Study)

A Chrome extension used to run the **QuantumTutor** user study on [PennyLane Codebook](https://pennylane.ai/codebook) coding exercises. It wraps PennyLane's built-in "Codercises" in a timed, controlled study environment and swaps the platform's default error feedback for one of three hint conditions: **LLM-generated hints**, **expert-written hints**, or **no hints (control)**. Every submission, hint and time measurement is logged to a study server.

This branch (`prolific_study`) is the version deployed for online participants recruited through [Prolific](https://www.prolific.com/).

---

## How it works

1. A participant opens the PennyLane Codebook page through a study link that carries their participant ID and assigned condition as URL parameters.
2. The extension stores both in `chrome.storage.local` and shows a floating **Start Test** button.
3. Once started, the participant works through exercises **I.1.1 – I.1.5**:
   - Only one exercise can be open at a time; opening one collapses the others.
   - Each exercise gets a **countdown timer** (configured in `config.js`) and a **Finish** button.
   - PennyLane's **"Compare solutions"** button is hidden so participants can't look up the answer.
   - An exercise that has been solved, finished or timed out is locked and can't be reopened.
4. On every code submission the extension reads the exercise text and the participant's code, then waits for PennyLane's result:
   - **Correct** → the exercise is marked complete and the result is logged.
   - **Incorrect** → PennyLane's error message is replaced with a hint according to the participant's condition (see below) and the attempt is logged.
5. When all exercises are complete, the participant is told to continue to the **Qualtrics** survey.

Progress (current state, solved exercises and remaining time per exercise) is persisted in `chrome.storage.local`, so a page reload doesn't reset the study.



## Installation

The extension isn't published on the Chrome Web Store; load it unpacked:

```bash
git clone -b prolific_study https://github.com/smritish21/Pennylane-Chrome-Ext.git
```

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select the cloned folder.
4. Go to `https://pennylane.ai/...` (the Codebook page with the study exercises), and **sign up or log in** to PennyLane. The extension checks for this and won't let the test start without it.

## Usage

Open the Codebook page with the participant ID and condition in the URL:

```
https://pennylane.ai/codebook/<module>?user=<PARTICIPANT_ID>&type=<CONDITION_CODE>
```

For example, `?user=abc123&type=cfdx` starts participant `abc123` in the expert-hints condition.

To reset a participant's progress while testing, clear the extension's storage (DevTools → *Application* → *Storage*, or remove and reload the extension).

## Configuration

**Time limits:** `config.js`
```js
const QUESTION_TIME = {
  "I.1.1": { time: 5 * 60 },   // seconds
  ...
  "I.1.5": { time: 7.5 * 60 }
};
```

**Expert hints:** `expertHints.js` maps each exercise ID to a list of hints; one is picked at random per wrong submission.

**Server endpoints:** set in `connect_llm.js` (LLM hints) and `save_data.js` (logging).

## Data collected

All records are sent as JSON `POST` requests to the study server:

| Event | Fields |
|-------|--------|
| Test started | participant ID, condition, timestamp |
| Each submission | participant ID, condition, timestamp, question text, submitted code, hint shown, whether correct, code length over time |
| Exercise closed / finished / timed out | participant ID, condition, exercise ID, time spent (minutes), reason |

## Project structure

```
├── manifest.json                    # Manifest V3 config; content scripts run on pennylane.ai
├── config.js                        # Per-exercise time limits
├── test_1.js                        # Main logic: start button, submit handling, condition-specific hints
├── offline_test_functionalities.js  # Study flow: state persistence, accordion control, timers, completion
├── connect_llm.js                   # Requests hints from the LLM endpoint
├── expertHints.js                   # Hand-written hints per exercise
├── save_data.js                     # Sends submissions, start events and timing data to the server
└── button_style.css                 # Floating panel and highlight styles
```


## Notes

- The extension depends on PennyLane's current DOM structure (e.g. `.Accordion`, `.CoderciseEditor`, `.cm-line`). If PennyLane changes its frontend, the selectors in `test_1.js` and `offline_test_functionalities.js` may need updating.
- It is research tooling built for one specific study, not a general-purpose extension.

## Acknowledgements

Developed at [DFKI](https://www.dfki.de/) as part of the QuantumTutor project. Exercises are from [PennyLane Codebook](https://pennylane.ai/codebook) by Xanadu.
