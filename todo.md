**addToAdviceCollection**
_Description_
Adds passed advice data to public advice collection if there is no advice with the same text content, then returns the id of the passed in advice, otherwise returns the stored advice id.

Conditions:
[-]: User must be authenticated and verified.
- If user is not authenticated, and yet we call the function, then it is a case of an app error.(Failed authorization).

Steps: 
[-]: Check if advice with the same id already exists.
[-]: if yes, return id.
[-]: if no, add advice data to firestore.
[-]: Return id.
