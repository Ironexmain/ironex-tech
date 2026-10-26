---
slug: oshibki-pri-proektirovanii-detalej
title: 'Ошибки при проектировании деталей: что удорожает заказ'
h1: 'Ошибки при проектировании деталей: что в чертеже удорожает изготовление и как этого избежать'
ogTitle: 7 ошибок в чертеже, из-за которых деталь дорожает в цеху
description: 'Тонкие стенки, глубокие карманы, лишние допуски: какие решения в чертеже растят цену и срок детали и что поправить до отправки в цех.'
date: '2026-10-26'
lastmod: '2026-10-26'
category: Экономика заказа
tags:
- oshibki-v-chertezhe
- tehnologichnost-konstrukcii
- frezerovka
- listovoj-metall
- ekonomiya-na-detali
seoKeywords:
- ошибки при проектировании деталей
- технологичность конструкции
- недостатки в чертеже
- тонкая стенка фрезерование
- глубокий карман фреза
- допуск на размер детали
cover: /images/blog/oshibki-pri-proektirovanii-detalej-cover.webp
coverAlt: Инженер сверяет чертёж с фрезерованной металлической деталью
robots: index, follow
schemaType: BlogPosting
draft: false
toc:
- id: pochemu-oshibka-dorozhaet
  label: Почему ошибка в чертеже дороже, чем кажется
- id: tonkie-steny-i-glubokie-karmany
  label: Тонкие стенки, глубокие карманы и острые углы
- id: rezba-i-otverstiya
  label: 'Резьба и отверстия: где чертёж требует лишнего'
- id: listovoj-metall
  label: 'Листовой металл: гиб, полки и отверстия у гиба'
- id: oshibki-v-samom-chertezhe
  label: Допуски, шероховатость и базы
- id: material-i-zagotovka
  label: Материал и заготовка
- id: tablitsa-oshibok
  label: Семь ошибок и цена
- id: proverka-do-zapuska
  label: Как проверить технологичность до запуска
- id: chek-list-i-vyvody
  label: Чек-лист перед отправкой чертежа
schemaVersion: '1.0'
clusterId: cl_002865be69
primaryQuery: ошибки при проектировании
queryFrequency: 0
frequencyProvider: ''
volatility: low
reviewDue: '2027-10-04'
readMin: 9
claims:
- claim_id: cf53967721a
  statement: Вертикальная стенка тоньше 0,0625 дюйма (около 1,6 мм) при фрезеровании прогибается, инструмент вибрирует и оставляет следы на поверхности.
  value: 0,0625 дюйма (около 1,6 мм)
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: eac2abcb985
  quote: Walls that are less than 0.0625-inch thick are likely to deflect during machining and result in tool chatter that can leave behind unappealing scars and surface blemishes.
  status: mismatch
  checked_at: '2026-10-26'
- claim_id: cfd29a8eee5
  statement: Для поверхности без следов вибрации толщину стенки закладывают не меньше 0,0625 дюйма.
  value: 0,0625 дюйма
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: e333e23db0d
  quote: For high-quality surface finishes, wall thicknesses should be 0.0625-inch thick or greater.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cf89dc57bd3
  statement: Тонкая стенка сильнее мешает обработке, когда стоит вертикально, перпендикулярно столу станка.
  value: вертикальная стенка
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: e792063574e
  quote: they become more of a burden when they are oriented vertically
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cd1a079f603
  statement: Отношение длины фрезы к диаметру при обработке кармана держат не больше 6:1. Фреза диаметром 0,5 дюйма (12,7 мм) рассчитана на глубину до 3 дюймов (около 76 мм).
  value: '6:1'
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: ea1d99ee7dc
  quote: Maximum tool length-to-diameter ratios should not exceed 6:1 (for example, a 0.5-inch end mill cutting 3 inches deep).
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c50895d35e0
  statement: Удлинённый или переточенный инструмент достаёт глубже шести диаметров, но заметно увеличивает машинное время и стоимость детали.
  value: машинное время и стоимость детали
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: e1f3a517e4f
  quote: Tools can often be custom ordered or ground back to achieve longer depths but that significantly increases machine time and part cost.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c8bc5fe0b0e
  statement: Острый внутренний угол можно закрыть разгрузочной выемкой и не заказывать электроэрозию, если ответная деталь это позволяет.
  value: электроэрозия
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: eb090487d3b
  quote: This can be accommodated without resorting to costly EDM operations.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: ca41023a31b
  statement: Метчик нестабильно нарезает резьбу, если глубина больше 2,5 диаметра.
  value: 2,5:1
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: ed152068a0e
  quote: Taps are very hard to thread consistently at aspect ratios greater than 2.5:1.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cd2d973787d
  statement: Если резьба проходит через плиту толщиной около 25 мм (1 дюйм), часть глубины раскрывают, чтобы не нарезать резьбу на всю толщину.
  value: 1 дюйм
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: eb644efd9df
  quote: If a 1/4-20 UNC thread must extend through the depth of a 1-inch plate, consider including some clearance to minimize thread engagement.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cabf16c5b6b
  statement: Плиту толщиной 0,0625 дюйма со стойками дешевле собрать со стойками-проставками, чем фрезеровать стойки из гораздо более толстой заготовки.
  value: 0,0625 дюйма
  source_id: se1f60231f6
  source_url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  evidence_id: e3448c6dbb2
  quote: For a plate that is 0.0625-inch thick, but requires clearance for positioning additional assembly components, consider using stand-offs in lieu of machining the posts from a much larger stock size. This can save material and machining time.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c9a67ec5630
  statement: Если деталь не выходит в допуск, когда оснастка уже стоит в прессе, переделка обходится дорого.
  value: оснастка в прессе
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: e1693bd5a9b
  quote: discovering a part can't be manufactured to spec is expensive, not to mention a major headache.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cb5ea4ee5b5
  statement: Физику формовки металла на станке не переписать.
  value: физика формовки
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: ed8694bc259
  quote: you can't change the physics of metal forming
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c7dfd649217
  statement: Отверстие на отогнутой полке, для которого нужен механический или гидравлический кулачок, увеличивает стоимость оснастки и её обслуживание.
  value: кулачковый привод
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: ebf81ada1bb
  quote: a pierced hole on a bent flange, one that would require a mechanical or hydraulically driven cam to pierce it, they know such an operation would increase tooling costs as well as die maintenance costs.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cca31a95158
  statement: Паз вместо круглого отверстия можно пробить в плоской заготовке до гибки, без кулачка.
  value: паз в плоской заготовке
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: e32ed116d8f
  quote: could be punched in the flat, instead of cam-piercing it
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cae53e67054
  statement: У листа толщиной 2 мм полка около 8 мм с внутренним радиусом 1,5–2 мм потребовала четыре удара штампа.
  value: 2 мм, полка 8 мм, радиус 1,5–2 мм, 4 удара
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: eb5f106d727
  quote: The high-strength, low-alloy material thickness was 2 mm. It had about a 1.5- to 2-mm inside corner radius, and the flange was about 8 mm.
  status: mismatch
  checked_at: '2026-10-26'
- claim_id: c2d56eb0f5a
  statement: Увеличение внутреннего радиуса примерно до 3 мм и укорочение полки примерно до 6 мм снизило число ударов штампа с четырёх до одного.
  value: 3 мм, полка 6 мм, 1 удар
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: ebe3bffdc30
  quote: By increasing the inside corner radius to about 3 mm and reducing the flange to about 6 mm, Bachman made the part a lot simpler to form, reducing the number of hits from four to one.
  status: mismatch
  checked_at: '2026-10-26'
- claim_id: c5cfa2219c3
  statement: Толщину детали увеличивали с 2 до 4 мм и одновременно меняли форму.
  value: 2–4 мм
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: e1852c3f406
  quote: the customer doubled the part thickness, from 2 to 4 mm, and changed the shape as well.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: cd0b4df0cbc
  statement: Длинные угловые полки могут не влезть в доступные позиции прогрессивного штампа.
  value: прогрессивный штамп
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: e23975695b4
  quote: The part had a few corners with flanges so long that they couldn't be formed within the available stations in the prog die.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: ca1d76106e2
  statement: После смены толщины с 2 до 4 мм правки формы сохранили прежнюю раскладку полосы в штампе.
  value: раскладка полосы
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: ef159fab824
  quote: But thanks to some part design tweaks, engineers were able to keep the same progression and, hence, save the customer money.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c8273a0022c
  statement: Сильно выступающий пуансон под отверстие или паз легко сломать. Конструкцию меняют так, чтобы пуансон остался жёстким.
  value: выступающий пуансон
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: e796906f0c6
  quote: a hole or slot that would require a die to have a punch to extend out significantly
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c72006821e7
  statement: Допуск ±0,002 дюйма (около ±0,05 мм) на некритичном периметре стоит пересмотреть и расширить, если такая точность функции не нужна.
  value: ±0,002 дюйма (около ±0,05 мм)
  source_id: s3a5dab7554
  source_url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  evidence_id: e99628cc745
  quote: the designer has it called out at ±0.002 in
  status: mismatch
  checked_at: '2026-10-26'
- claim_id: c834ca1d981
  statement: ГОСТ 2.307-2011 задаёт правила нанесения размеров и предельных отклонений на чертежах.
  value: ГОСТ 2.307-2011
  source_id: sde95308b4d
  source_url: https://ru.wikisource.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_2.307%E2%80%942011
  evidence_id: e578f5fb96e
  quote: Настоящий стандарт устанавливает правила нанесения размеров и предельных отклонений в графических документах на изделия всех отраслей промышленности и строительства.
  status: mismatch
  checked_at: '2026-10-26'
- claim_id: ca4273d2435
  statement: Число размеров на чертеже оставляют минимальным, но достаточным для контроля.
  value: минимальное число размеров
  source_id: sde95308b4d
  source_url: https://ru.wikisource.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_2.307%E2%80%942011
  evidence_id: e15543229d8
  quote: Общее количество размеров должно быть минимальным, но достаточным для изготовления и контроля изделия.
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c32a6a9994c
  statement: Один размер замкнутой размерной цепи делают справочным и предельные отклонения у него не указывают.
  value: справочный размер
  source_id: sde95308b4d
  source_url: https://ru.wikisource.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_2.307%E2%80%942011
  evidence_id: e9e52326a4f
  quote: один из размеров замкнутой размерной цепи. Предельные отклонения таких размеров на чертеже не указывают
  status: confirmed
  checked_at: '2026-10-26'
- claim_id: c0272561059
  statement: Неуказанные предельные отклонения ГОСТ 2.307-2011 относит к общим допускам по ГОСТ 30893.1.
  value: ГОСТ 30893.1-2002
  source_id: sde95308b4d
  source_url: https://ru.wikisource.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_2.307%E2%80%942011
  evidence_id: e22dcb8e515
  quote: (ИСО 2768-1—89) Основные нормы взаимозаменяемости. Общие допуски. Предельные отклонения линейных и угловых размеров с неуказанными допусками
  status: mismatch
  checked_at: '2026-10-26'
sources:
- url: https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers
  title: Five Design for Manufacturability Tips for Designers
  trusted: false
  rel: noopener
  block: true
- url: https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability
  title: Design for Manufacturability
  trusted: false
  rel: noopener
  block: true
- url: https://ru.wikisource.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_2.307%E2%80%942011
  title: ГОСТ 2.307-2011. Нанесение размеров и предельных отклонений
  trusted: false
  rel: noopener
  block: true
- url: https://commons.wikimedia.org/wiki/File:US_Army_soldier_welding_two_metal_pieces,_Fort_Gregg-Adams,_Virginia,_March_2025.jpg
  title: Juan F. Jimenez, Army
  trusted: false
  rel: nofollow noopener
  block: false
- url: https://creativecommons.org/publicdomain/mark/1.0/
  title: Public domain
  trusted: false
  rel: nofollow noopener
  block: false
- url: https://commons.wikimedia.org/wiki/File:1990s_BUFO_M12_110_hex_head_bolt_by_Bulten_AB_Hallstahammar_Sweden_view_2.jpg
  title: R. Henrik Nilsson
  trusted: false
  rel: nofollow noopener
  block: false
- url: https://creativecommons.org/licenses/by/4.0
  title: CC BY 4.0
  trusted: false
  rel: nofollow noopener
  block: false
canonicalUrl: https://ironex.tech/blog/oshibki-pri-proektirovanii-detalej.html
---

<p class="b-lede-p">Деталь дорожает из-за решений в чертеже: стенки тоньше 1,6 мм, глубокие карманы, допуски «на всякий случай», резьба на всю глубину. Каждое такое решение заставляет цех брать другой инструмент, делать лишние установы или переделывать оснастку. Ниже — что именно меняется и как поправить чертёж до запуска.</p>

## Почему ошибка в чертеже дороже, чем кажется

Когда вы в последний раз спрашивали у цеха, какая строка чертежа делает деталь дороже? По чертежу цех выбирает инструмент, число установов и припуски, поэтому технологичность конструкции задаёт стоимость детали ещё до запуска. Ориентир статьи — фрезерование и лист, предел станка назовёт технолог.

Решение на чертеже превращается в другой инструмент, лишний установ и лишние минуты станка. В цехе это смена фрезы или спор на приёмке. Технологичность конструкции снижает стоимость детали, когда такие решения убирают до заказа инструмента.

Если деталь не выходит в допуск, когда оснастка уже стоит в прессе, переделка обходится дорого и сдвигает срок. Физику формовки металла не переписать, поэтому технолога зовут до проектирования оснастки.

Оснастка входит в стоимость детали вместе с материалом и машинным временем. Если её не учесть заранее, сумма всплывёт на запуске. Как собрана цена: [из чего складывается цена детали](/razdel/ekonomika-zakaza.html).

> Цена детали закладывается в чертеже. В цехе её уже считают по инструменту, установам и машинному времени.

<!-- inline-cta -->

## Тонкие стенки, глубокие карманы и острые углы

![Сварщик соединяет две металлические детали при помощи сварки](/images/blog/oshibki-pri-proektirovanii-detalej-1.webp)

*Сварка металлических деталей — важный этап производства, требующий контроля качества соединения. Фото: [Juan F. Jimenez, Army](https://commons.wikimedia.org/wiki/File:US_Army_soldier_welding_two_metal_pieces,_Fort_Gregg-Adams,_Virginia,_March_2025.jpg) · [Public domain](https://creativecommons.org/publicdomain/mark/1.0/)*


Тонкая стенка, глубокий карман и острый внутренний угол мешают фрезе держать жёсткость. Отсюда рост стоимости детали.

### Стенка тоньше 1,6 мм

Тонкая стенка прогибается под фрезой, и инструмент вибрирует. Сильнее всего это мешает, когда стенка стоит вертикально, перпендикулярно столу станка.

Заложите не меньше 1,6 мм (0,0625 дюйма). Это ориентир фрезерования, к ГОСТ он не привязан.

> **Факт.** Стенка тоньше 0,0625 дюйма (около 1,6 мм) при фрезеровании прогибается: вибрация инструмента оставляет на поверхности следы.

### Карман глубже шести диаметров фрезы

Глубокий карман увеличивает стоимость детали: растут вылет фрезы и машинное время. Длину к диаметру держат не больше 6:1. Фреза 12,7 мм режет до 3 дюймов, около 76 мм. Удлинённый или переточенный инструмент достанет глубже, но заметно добавит машинного времени и стоимости. Уменьшите глубину кармана или заранее согласуйте с технологом длинный инструмент.

### Острый внутренний угол

Фреза оставляет в углу свой радиус. Острый угол закрывают электроэрозией, и цена растёт. Сделайте разгрузочную выемку, если ответная деталь это позволяет. На чертеже выемку покажите явно и согласуйте до запуска.

## Резьба и отверстия: где чертёж требует лишнего

Резьбовое отверстие дорожает, когда резьба глубже, чем нужно сборке, или когда к нему не подобраться с одной установки.

Метчик нестабильно нарезает резьбу при глубине больше 2,5 диаметра. В чертеже укажите рабочую длину резьбы. Формулировку «на всю глубину» уберите.

Если резьба проходит плиту толщиной около 25 мм, оставьте рабочую длину зацепления, а остальную глубину раскройте расточкой или зенковкой.

Перед запуском сверьте каждое резьбовое отверстие по трём вопросам:

- Какая рабочая длина резьбы нужна сборке.
- Подходит ли метчик к отверстию с одной установки.
- Можно ли остальную глубину раскрыть расточкой.

Отверстие на боковой грани добавляет установ. Если сборка позволяет, разверните ось к шпинделю и укажите сторону захода.

## Листовой металл: гиб, полки и отверстия у гиба

![Болт метрической резьбы M12](/images/blog/oshibki-pri-proektirovanii-detalej-2.webp)

*Болт с метрической резьбой M12, шестигранная головка, длина 110 мм, класс 8.8. Фото: [R. Henrik Nilsson](https://commons.wikimedia.org/wiki/File:1990s_BUFO_M12_110_hex_head_bolt_by_Bulten_AB_Hallstahammar_Sweden_view_2.jpg) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0)*


В штамповке листа цена уходит в оснастку: кулачок входит в стоимость детали. Пример ниже — кронштейн из низколегированной стали повышенной прочности, лист 2 мм, прогрессивный штамп. Число ударов взято из штамповки, на лазере и листогибе его не переносите. Радиус гиба и отступ отверстия от линии гиба спросите у технолога.

### Отверстие на отогнутой полке

Пробивка отверстия на отогнутой полке требует кулачка, механического или гидравлического. Это поднимает стоимость оснастки и её обслуживание. Сильно выступающий пуансон легко сломать. В чертеже перенесите отверстие в плоскую зону до гиба или укажите кулачок в заявке отдельной строкой.

### Паз вместо круглого отверстия

Паз пробивается в плоской заготовке до гибки, без кулачка. В чертеже замените круг на паз, если болту нужна фиксация только по одной оси.

### Радиус и длинная полка

У листа 2 мм полка около 8 мм с радиусом 1,5–2 мм потребовала четыре удара штампа. Радиус около 3 мм и полка около 6 мм свели формовку к одному удару. Если полка длиннее, чем нужно сборке, укоротите её.

Слишком длинные полки могут не влезть в позиции прогрессивного штампа. Когда толщину увеличили с 2 до 4 мм и поменяли форму, правки в детали позволили сохранить прежнюю раскладку полосы.

## Допуски, шероховатость и базы: ошибки внутри самого чертежа

Допуск на размер, шероховатость поверхности и базы решают, сколько проходов сделает цех и чем закончится приёмка.

Допуск ±0,002 дюйма (около ±0,05 мм) на свободном периметре расширьте, если точность не нужна. На контуры без своего допуска ставьте общие допуски. ГОСТ 2.307-2011 задаёт нанесение размеров и отсылает неуказанные отклонения к ГОСТ 30893.1.

> Жёсткий допуск нужен там, где он влияет на работу узла.

> **Мнение.** Если размер не входит в посадку и не держит нагрузку, расширяйте допуск: поле около ±0,05 мм на свободном контуре лишь поднимает стоимость детали.

Без баз станочник и контролёр могут мерить от разных граней. По ГОСТ 2.307-2011 один размер замкнутой цепи делают справочным, отклонения у него не указывают. Число размеров оставляют минимальным, но достаточным для контроля.

Если на чертеже нет материала, состояния поставки, термообработки или покрытия, цех возьмёт то, что есть на складе, или остановит запуск. Шероховатость ставьте по функции поверхности, а не одной строкой на весь чертёж. Оформление модели — в материале про [форматы чертежей, CAD и требования ГОСТ для цеха](/blog/proektirovanie-detaley-cad-chertezhi-formaty-gost). В заявке укажите, какой документ главный при расхождении модели и чертежа.

## Материал и заготовка: когда чертёж выбирает дорогой путь

Заготовка влияет на стоимость детали ещё до первого реза. Плиту 1,6 мм со стойками дешевле собрать со стойками-проставками, чем фрезеровать стойки из гораздо более толстой заготовки. Стойки ставят отдельными деталями, основание оставляют листом.

> Тонкую плиту и стойки дешевле сделать разными деталями, чем вырезать стойки из толстой заготовки: экономятся материал и машинное время.

Редкая марка сдвигает старт на срок поставки. Если расчёт позволяет, возьмите марку, которая уже есть у цеха. Замену по прочности и коррозии подтвердите расчётом.

Сварка и термообработка могут повести деталь. Припуск под финиш оставьте там, где размер нужен после отпуска или шва, и впишите его отдельной поверхностью. Величину коробления назовёт технолог.

Как задумал заказчик: стойки заодно с основанием 1,6 мм из толстой плиты. Как технологичнее: лист 1,6 мм и отдельные стойки с посадкой в отверстия. Второй вариант приложите к заявке, если узел его допускает.

## Семь ошибок: что происходит в цехе и как поправить

Семь ошибок можно сверить по чертежу за один проход. Технологичность конструкции здесь видна по столбцу правки.

| Ошибка | Что происходит в цехе | Как исправить |
| --- | --- | --- |
| Стенка тоньше 1,6 мм | Стенка прогибается, фреза вибрирует, остаются следы | Заложить толщину от 1,6 мм |
| Глубокий карман | Нужна длинная фреза, растёт машинное время | Держать глубину до 6 диаметров фрезы |
| Острый внутренний угол | В маршрут может попасть электроэрозия | Сделать разгрузочную выемку, если сборка позволяет |
| Резьба на всю глубину | Метчик нестабилен глубже 2,5 диаметров | Оставить рабочую длину, остальное расточить |
| Лишний допуск | Точность, которой функция не требует | Расширить поле на свободном контуре |
| Отверстие на отогнутой полке | В штампе нужен кулачковый привод | Перенести отверстие в плоскую зону или сделать паз |
| Толстая заготовка вместо плиты и стоек | Лишний металл и машинное время | Поставить стойки отдельными деталями |

Толщину стенки, глубину кармана, длину резьбы и свободный допуск можно поправить в файле самостоятельно. Отверстие на полке, радиус гиба и составную деталь согласуют с работой узла.

## Как проверить технологичность до запуска

Проверка технологичности до запуска — разговор с технологом по готовому пакету, пока чертёж ещё можно изменить без переделки оснастки. В таком разговоре видно, какой допуск можно расширить.

1. Соберите PDF чертежа, модель в STEP или DXF, марку, состояние поставки и количество.
2. Отправьте пакет на проверку до заказа инструмента и оснастки.
3. Ответьте, как деталь работает, какие поверхности критичны и какой допуск нужен по функции.
4. Поправьте радиус, глубину, резьбу или положение отверстия и пометьте, какой файл главный.
5. Для новой гибки, сварки или большой серии сначала сделайте пробную деталь, затем запускайте партию.

Пробная деталь нужна для непроверенного процесса: первый гиб листа повышенной прочности, глубокая формовка, размеры после термообработки.

Срок согласования и рост цены после запуска зависят от загрузки и от того, заказан ли инструмент. Обе цифры назовёт технолог по вашему пакету.

## Чек-лист перед отправкой чертежа в цех

Перед отправкой пройдите чертёж по десяти пунктам. Правка в файле обходится дешевле лишнего инструмента.

- Проверьте стенки: от 1,6 мм, вертикальные только по функции.
- Ограничьте глубину кармана шестью диаметрами фрезы цеха.
- Замените острый угол разгрузочной выемкой.
- Оставьте у резьбы рабочую длину.
- Уберите отверстие с отогнутой полки или замените его пазом.
- Уточните радиус гиба и отступ отверстия от линии гиба.
- Расширьте допуск на контуре вне посадки и нагрузки.
- Назначьте шероховатость по функции поверхности.
- Укажите базы, материал, состояние поставки, термообработку и покрытие.
- Сверьте модель, спецификацию и чертёж и напишите, какой документ главный.

Стенки, карманы, резьбу, допуски, базы и материал можно закрыть самому. Радиус гиба и вопрос составной детали отдайте технологу. Резьбу на всю глубину и допуск «на всякий случай» не закладывайте.

Как разложить файлы в заявке, описано в материале [как составить заявку на расчёт изготовления деталей](/blog/kak-podgotovit-zapros-na-raschet-izgotovleniya-detaley). Когда PDF и модель собраны, [пришлите чертёж на расчёт](/kontakty.html) до заказа инструмента.

## Частые вопросы

### Нужно ли показывать чертёж технологу до запуска?

Да, до заказа оснастки. Если выяснится, что деталь не держит допуск, когда штамп уже в прессе, переделка бьёт и по сроку, и по деньгам. Технолог на этом шаге смотрит доступ инструмента, гибы и поля, которые можно расширить без потери функции.

### Как проверить чертёж перед отправкой в цех?

Пройдите стенки, глубину карманов, резьбу, допуски, шероховатость, базы, материал и состояние поставки. Затем отправьте PDF вместе с моделью в STEP или DXF и строкой, какой файл главный при расхождении.

### К чему приводят ошибки в чертеже?

К другому инструменту, лишним установам, большему машинному времени и переделке оснастки. Всё это попадает в цену и срок ещё до того, как станок сделает первую годную деталь.

## Источники

- [Five Design for Manufacturability Tips for Designers](https://www.mmsonline.com/articles/five-design-for-manufacturability-tips-for-designers) — Modern Machine Shop
- [Design for Manufacturability](https://www.thefabricator.com/thefabricator/article/bending/design-for-manufacturability) — The Fabricator
- [ГОСТ 2.307-2011. Нанесение размеров и предельных отклонений](https://ru.wikisource.org/wiki/%D0%93%D0%9E%D0%A1%D0%A2_2.307%E2%80%942011) — межгосударственный стандарт ЕСКД
