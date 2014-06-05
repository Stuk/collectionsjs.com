---

name: SortedArraySet

names:
-   SortedArraySet()
-   SortedArraySet(values)
-   SortedArraySet(values, equals, compare)
-   SortedArraySet(values, equals, compare, getDefault)

methods:
-   add
-   reduce
-   reduce-right

---

A collection of unique values stored in sorted order, backed by a plain array.

--- |

If the given values are an actual array, the `SortedArraySet` takes ownership of
that array and maintains its content.
The user can then observe that array for changes.

A sorted array sets performs better than a `SortedSet` when it has roughly less
than 100 values.

`SortedArraySet` instances fly the `isSorted` and `isSet` flags.

