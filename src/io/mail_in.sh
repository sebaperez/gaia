#!/bin/bash

# ${sender} ${size} ${recipient}

sender="$1"
size="$2"
recipient="$3"

curl -H "Content-Type: application/json" -d "{\"sender\": \"${sender}\", \"size\": \"${size}\",  \"recipient\": \"${recipient}\"}" http://localhost:3090/newmail