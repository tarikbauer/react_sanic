import random


def generate_scores(data: dict, semester: str, subject: str):
    grades = list(map(lambda x: x / 100, range(0, 1001)))
    ve, vc, vf = random.choice(grades), random.choice(grades), random.choice(grades)
    average = round(float(((ve + vc)/2 + vf)/2), 2)
    scores = {'VE': ve, 'VC': vc, 'VF': vf, 'Average': average}
    data[semester]['scores'].append({subject: scores})


def generate_semester(content: dict, semester: str, subjects: list):
    data = {semester: {'scores': [], 'faults': random.choice(range(0, 121)), 'Average': 0}}
    list(map(lambda x: generate_scores(data, semester, x), subjects))
    average, index = 0, 0
    for index, scores in enumerate(data[semester]['scores']):
        for subject, score in scores.items():
            average += score['Average']
    data[semester]['Average'] = round(average/(index + 1), 2)
    content.update(data)


def generate_content() -> dict:
    content = {}
    generate_semester(content, '01/2015', ['Química I', 'Introdução à Computação', 'Física I', 'Cálculo I',
                                           'Álgebra Linear I'])
    generate_semester(content, '02/2015', ['Química II', 'Desenho Técnico', 'Física II', 'Cálculo II',
                                           'Álgebra Linear II'])
    generate_semester(content, '01/2016', ['Redação', 'Ciências do Ambiente', 'Mecânica I', 'Cálculo III',
                                           'Física III', 'Eletrecidade Técnica', 'Ciência do Materiais'])
    generate_semester(content, '02/2016', ['ResMat', 'Cálculo Numérico', 'Física IV', 'Cálculo IV',
                                           'Probabilidade', 'Mecânica II', 'Ética', 'Tema Dirigido'])
    return content
