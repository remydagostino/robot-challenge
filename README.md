# Robot-Challenge

A cute little programming challenge.

See spec.md for the specification.

## Dev log

- This program is essentially a pipeline with these distinct steps:
	1. Read input line by line
	2. Parse each line into a machine instruction
	3. Apply each instruction to the application state
	4. Check the application state is valid, if not roll back to the previous state
	5. Execute any effects (logging) requested by the action
- I think it makes most sense (maximum flexibility) to read the input from stdin and write to stdout.
- It makes sense to decouple the execution engine from the input source, as such, the executor will output and take as its input a generic async iterator
- I've decided to make the parser insensitive to casing and whitespace, this should make it more user friendly.