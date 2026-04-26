export const GRID_LETTERS = 'abcdefghijklmnopqrstuvwxyz'

// Individual grid layout for every photo count 1–15
export const PHOTO_GRIDS = {
  1:  { cols: '1fr',                     rows: '520px',                          areas: '"a"' },
  2:  { cols: '1fr 1fr',                 rows: '420px',                          areas: '"a b"' },
  3:  { cols: '2fr 1fr',                 rows: '220px 220px',                    areas: '"a b" "a c"' },
  4:  { cols: '1fr 1fr',                 rows: '280px 280px',                    areas: '"a b" "c d"' },
  5:  { cols: '1fr 1fr 1fr',             rows: '300px 220px',                    areas: '"a a b" "c d e"' },
  6:  { cols: '1fr 1fr 1fr',             rows: '240px 240px',                    areas: '"a b c" "d e f"' },
  7:  { cols: '1fr 1fr 1fr',             rows: '250px 190px 190px',              areas: '"a a b" "c d e" "f g g"' },
  8:  { cols: '1fr 1fr 1fr 1fr',         rows: '230px 230px',                    areas: '"a b c d" "e f g h"' },
  9:  { cols: '1fr 1fr 1fr',             rows: '210px 210px 210px',              areas: '"a b c" "d e f" "g h i"' },
  10: { cols: '1fr 1fr 1fr 1fr',         rows: '230px 190px 190px',              areas: '"a a b c" "d e f g" "h i j j"' },
  11: { cols: '1fr 1fr 1fr 1fr',         rows: '210px 210px 210px',              areas: '"a b c d" "e f g h" "i j k k"' },
  12: { cols: '1fr 1fr 1fr 1fr',         rows: '200px 200px 200px',              areas: '"a b c d" "e f g h" "i j k l"' },
  13: { cols: '1fr 1fr 1fr 1fr',         rows: '220px 180px 180px 180px',        areas: '"a a b c" "d e f g" "h i j k" "l m m m"' },
  14: { cols: '1fr 1fr 1fr 1fr 1fr',     rows: '230px 200px 200px',              areas: '"a a b c d" "e f g h i" "j k l m n"' },
  15: { cols: '1fr 1fr 1fr 1fr 1fr',     rows: '200px 200px 200px',              areas: '"a b c d e" "f g h i j" "k l m n o"' },
}
