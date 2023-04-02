# Description

Implementation of an interpreter for a custom programming language similar to Javascript, called EVA.
EVA is a dynamic programming language with functional and OOP support.

The parser for EVA was generated with [syntax-cli](https://www.npmjs.com/package/syntax-cli).

For an example implementation of a manually built recursive-descent parser have a look at my [parser project](https://github.com/nicoladaniello/parser).

### Execute inline command

`./bin/eva -e '(var x 10) (print x)'`

Will print `10`.

### Execute file

Save a file with some EVA code and execute it with the `-f` param.

Example:

```
// point.eva

(class Point null
    (begin
        (def constructor (this x y)
            (begin
                (set (prop this x) x)
                (set (prop this y) y)
            )
        )

        (def calc (this)
            (begin
                (+ (prop this x) (prop this y))
            )
        )
    )
)

(var p (new Point 10 20))

((prop p calc) p)
```

To run:

`./bin/eva -f point.eva`
