from collections import defaultdict, Counter
import json

# parameters
categories = 'photo'
compare = 'correct'

data = json.load(open('responses.json'))

totals = defaultdict(Counter)

for response in data:
    totals[response[categories]][response[compare]] += 1

print(categories, '-->', compare)

for category, compare in sorted(totals.items()):
    n = sum(compare.values())
    print(category, f'({n} responses)')
    for answer, count in sorted(compare.items()):
        print('\t', end = '')
        print(answer, f'{round(count / n * 100, 1)}%')
