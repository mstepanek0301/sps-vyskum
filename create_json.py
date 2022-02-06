import json

key = [
    (1.5, 'z'), (3, 's'), (2, 'g'), (3, 'g'), (0.5, 'g'), (3, 'z'),
    (2, 's'), (2, 's'), (1, 'g'), (4, 'z'), (2.5, 'z')
]

data = []

for line in open('responses.csv'):
    if line.isspace(): continue

    age, yrs, (cf, cs), *answers = line.strip().split(',')
    age, yrs, cf = map(float, (age, yrs, cf))

    ps = []
    for p in range(11):
        c, f, s = answers[3 * p: 3 * (p + 1)]
        c, f = map(float, (c, f))
        ps.append(dict(
            # photo data
            photo = p, floor = key[p][0], side = key[p][1],
            # person data
            age = age, yearsAtSchool = yrs,
            local = ('all' if cf == key[p][0] else 'side') if cs == key[p][1]
            else ('floor' if cf == key[p][0] else 'none'),
            # guess
            seen = c, guessedFloor = f, guessedSide = s,
            correct = ('all' if f == key[p][0] else 'side') if s == key[p][1]
            else ('floor' if f == key[p][0] else 'none'),
        ))

    data.extend(ps)

json.dump(data, open('responses.json', 'w'))
