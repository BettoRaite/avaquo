### Auth flow
#### Sign up

[-]: Sign up user.
[-]: Save the user name to local storage.
[-]: Navigate to verification page.

*Notes*:
- I decided to store user data in local storage
until user email has been verified, only then
will I store the user data in firestore. The
reason for that is simple. 
Imagine if the user wants to test my application he/she
enters in valid input in the sign up
form, then goes to the verification
page, but never verifies and leaves
the app. In other words, the user data
will have to be stored in firestore indefinitely.

Probably, there is a workaround that 
which is storing user data only temprorary
resetting the count on each log in, but this would
require additional complex logic. 