# Auto Toggle Mode Plugin Test Plan

## Test Cases

### Test Case 1: Window Minimization/Tab Switching
**Expected Behavior**: Plugin should immediately switch to reading mode when window is minimized or tab is switched
- Open a note in reading mode
- Click to switch to editing mode
- Minimize the Obsidian window
- **Expected**: Should switch to reading mode immediately

### Test Case 2: Immediate Click-to-Edit
**Expected Behavior**: Plugin should immediately switch to editing mode when clicking on a note in reading mode
- Open a note in reading mode
- Click anywhere on the note
- **Expected**: Should immediately switch to editing mode

### Test Case 3: No Automatic Timeout Switching
**Expected Behavior**: Plugin should NOT automatically switch based on time or inactivity
- Open a note in reading mode
- Click to switch to editing mode
- Stop all activity (don't move mouse, type, or scroll)
- Wait for any amount of time (even longer than timeout setting)
- **Expected**: Should remain in editing mode (no automatic switching)

### Test Case 4: Switching Between Notes
**Expected Behavior**: Plugin should correctly handle switching between different notes
- Open Note A in reading mode
- Click to switch to editing mode
- Open Note B in reading mode
- Click on Note B
- **Expected**: Should switch Note B to editing mode

### Test Case 5: Manual Mode Switching Compatibility
**Expected Behavior**: Plugin should work correctly with manual mode switching
- Open a note in reading mode
- Click to switch to editing mode
- Use Obsidian's built-in shortcuts to switch back to reading mode
- Click to switch back to editing mode
- **Expected**: Should work correctly with manual switching

### Test Case 6: Accurate Mode Detection
**Expected Behavior**: Plugin should correctly detect the current view mode
- Open a note in reading mode
- Manually switch to editing mode using Obsidian's built-in controls
- Click on the note
- **Expected**: Should remain in editing mode (no double switching)

### Test Case 7: No Interference in Editing Mode
**Expected Behavior**: Plugin should NOT interfere with normal editing interactions
- Open a note in reading mode
- Click to switch to editing mode
- Try to select text, click on editing elements, etc.
- **Expected**: Should allow normal editing interactions without interference

## Test Results

### Test Case 1: Window Minimization/Tab Switching
- [ ] Pass
- [ ] Fail

### Test Case 2: Immediate Click-to-Edit
- [ ] Pass
- [ ] Fail

### Test Case 3: No Automatic Timeout Switching
- [ ] Pass
- [ ] Fail

### Test Case 4: Switching Between Notes
- [ ] Pass
- [ ] Fail

### Test Case 5: Manual Mode Switching Compatibility
- [ ] Pass
- [ ] Fail

### Test Case 6: Accurate Mode Detection
- [ ] Pass
- [ ] Fail

### Test Case 7: No Interference in Editing Mode
- [ ] Pass
- [ ] Fail