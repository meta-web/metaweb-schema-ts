## Types

Schema Type = User defined or built-in schema
Return Type = data structure with optional actions

## Schema

- Identifier (name)
- Generics (can be passed to other types)
- Parameters (arguments)
	- Identifier : Schema Type Reference
- Body (lambda function)
	- Can declare local variables
		- Identifier
		- Schema Type Reference
		- Default value
	- Must return
		- Schema
		- Return Type


Type expression = SchemaRef | Union | Intersection | Struct | Array | Map