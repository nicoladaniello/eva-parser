# Description

Implementation of a recursive descent parser for a custom programming language similar to Javascript, called EVA.
EVA is a dynamic programming language with a simple syntax, functional and OOP support.

### Execute inline command

`./bin/eva -e '(var x 10) (print x)'`

Will print `10`.

### Execute file

Save a file with the code. Here is an example:

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
