## Testing

Add syntactic support for writing test.

```
test "My Test Suite" {

	test "My Test Group" {

		test "Test One" {

			// Declare variable
			let x = multiplyMe(value: 24);

			// Check value
			assert x == 48;

			// Set's multiplier to 0.5 = x/2; effect is taken immediately due to schema's reactive nature.
			invoke x#setMultiplier(mp: 0.5);

			assert x == 12;

		}

	}

}
```

## Partial AST

Modify parser to be able to return partially parsed AST,
so we can do basic semantics checks on not fully valid code.
This will enhance IDE editing experience, because currently,
when code is synatically invalid we don't have any of semantic
features.

## Action flow control

S**t, I just realized that actions have a procedural code.

So it makes sense to implement flow control directly into actions.
But there will be no for(a, b, c) or while... it may cause ifinite loops.

```
schema MySchema(
	x: Number = 42;
) {
	let a = x;

	action DoSomething() {

		let some = somethingWhichCanBeAsync();
		let y = @x * 2;

		if (y > 0) {
			invoke some#action();
			set a = y;
		} else {
			invoke some#otherAction();
			await some;
			throw Error("Some error message.");
		}

	}

}
```

## Pipe operator

To allow simple chaining of schema calls just like in functional languages.
Only question is how to specify parameter name.

```
let x = @a
	|> filter(value: _, do: (val) => val > 0)
	|> map(value: _, do: (val) => val * 2);
```

## Power operator

Add support for power numeric operator.

```
let x = 2 ^ 3;
```

## Add watch parametr to statefull variables

When a variable is set as statefull, it can receive a list of watch arguments.
When watch argument changes the variable value is set to it's initial value.

schema ModelText(
	value: String;
) {

	let state value = @value;

	// When any of watch expression changes compared to its value from a previous schema update,
	// variable is set to its initial value.
	let state { <watch_expression>, <watch_expression> } = <initial_value>;

	// When @value changes, touched is set to false.
	let state { @value } touched = false;

}

## Analyzer

1. Create ASG for a document
2. Resolve imports (go to step 1 for every imported document)
3. Check symbols on all documents
4. Check types and call signatures on all documents
