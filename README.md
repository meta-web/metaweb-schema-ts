# metaweb-schema-ts

TypeScript implementation of META Schema parser, analyzer, compiler and run-time.

**WORK IN PROGRESS**

**Project status:**

- [X] Syntax definition
- [X] Syntax parser
- [X] Syntax highligher (TextMate2, not yet published)
- [ ] Semantic analyzer
  - [ ] Build ASG (Abstract Semantic Graph) *in progress*
  - [ ] Check symbols and assign references
  - [ ] Resolve and check types
  - [ ] Check call arguments
- [ ] Compiler
- [ ] Language Service (partialy done)
- [ ] VS Code Extension (partialy done)

## What is META Schema?

In short - **META Schema is a computational graph for data transformation**.

### What the heck? What is it good for?

Nowadays we have a lot of APIs and data source in the wild. But they lack semantic meaning.
Yes, we have API specification, in both machine a human-readable format. But adding meaning
to our data often means transforming them which needs logic and computations.

### Why not use common programming languages?

Let's say you want to use a third-party data source. As was said, API specification is not enough.
It cannot represent logic between data, you cannot build interactive UIs based on them (well, you can,
but primitive ones) and such. So in order to add some logic to the data source, we can load some external
code instead of API spec. But running an untrusted third party code in our app? Really, it's not a good idea.
It's dangerous and it can be a pretty pain in the ass.

So to solve mentioned issues meta schema is a declarative "language". It just defines a computational graph
which transforms input data into an understandable data structure.

### How does it work?

At first, we define a schema. This schema can be transferred over the network to other applications and clients.

Then, target application such as a user client or a back-end service can load the schema and compile it into
runtime code which is safe and optimized for a given platform.

This library provides a parser to parse source files into AST (Abstract Syntax Tree), analyzer to do semantic validation and compiler to compile AST into a runtime code.

### Is it Turing complete?

No. META Schema is not a procedural programming language. It is similar to functional languages but still, it's not
a programming language, it's a computational graph. It doesn't support typical loops such as `for` or `while`. Instead,
it has built-in map and reduce functions. Also, it supports recursion but it has a limited depth to avoid infinite loops
so you should avoid using recursion when possible.

## Usage

Coming soon. We should have some documentation. It's not so simple to be described in a README file.

But here you go with a little syntax teaser - [To-do App](./examples/TodoApp.meta)

## One More Thing

This library also includes a `LanguageServices` which provides features such as code validation, semantic analysis and autocompletion. Service can be used in a language server implementation to provide intelliSense features for IDEs. Also, we simultaneously work on a language extension for VS Code.

## Building & Testing

```bash
# Build
npm run build

# Test (is automatically run before the package is published)
npm run test

# Run one test
npm run test-one <test_name>

# Generate API documentation
npm run doc

# Run linter (is automatically run before tests)
npm run lint
```

## License

Copyright 2020 Jiri Hybek <jiri@hybek.cz> [https://jiri.hybek.cz/](https://jiri.hybek.cz/) and META Web contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.