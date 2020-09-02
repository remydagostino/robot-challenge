# Robot-Challenge

A cute little programming challenge.

See [spec.md](https://github.com/remydagostino/robot-challenge/blob/master/spec.md) for the specification.

## Setup

This project was developed and tested with Node v12.16.3, and NPM 6.14.4. It should work with any node > 12.

### Dependencies

Typescript is required to compile the project. I am using ts-node to compile and run the project without creating the intermediary files. Jest (with ts-jest) is used to run the tests for the project. All other listed dependencies are for code formatting and linting only. At runtime, no 3rd party code is used. 

### Local installation and execution

- Run `npm install` in the root directory
- Run `npm run test` to execute the unit and integration tests
- To run the program against an input file, such as the ones in `example-data`, use `npm run main < example-data/example1`
- Running the program without a file, `npm run main` creates starts a REPL where robot instructions can be entered directly

### Installation with docker

- Run `docker build -t remydagostino/robot-challenge .` in the root directory
- Run the tests with `docker run -i remydagostino/robot-challenge npm run test`
- Run the program reading from stdin/out with `docker run -i remydagostino/robot-challenge npm run main`
- Pipe a file with `cat example-data/example1.txt | docker run -i remydagostino/robot-challenge npm run main`
- Have fun!

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
- I considered allowing input to support comments starting with '#' but decided against due to concerns about extending the spec
