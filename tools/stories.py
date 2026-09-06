# -*- coding: utf-8 -*-
"""
각 프로젝트 본문. portfolio_full.pdf 의 서술 논리를 따른다:
문제 상황 -> 전략 -> 시스템 -> 공간 -> 경험.

블록 형식:
    ('lede', 글)      머리글
    ('p',    글)      문단
    ('h',    글)      소제목
    ('fig',  번호, 캡션, alt)   그림 한 장
"""

STORIES = {}

# --------------------------------------------------------------- Homeostasis
STORIES['0A_11_homeostasis'] = [
    ('lede', 'Rapid changes in weather have quietly confined us indoors. On days of '
             'heavy rain, extreme heat or severe cold we simply stay in, and the '
             'distance between daily life and the outdoors grows a little wider each '
             'year. This shelter asks whether an outdoor room can be conditioned the '
             'way an interior is — not by imitating nature, but by moderating it.'),

    ('h', 'A stationary room in a moving place'),
    ('p', 'Yongbi Bridge crosses Jungnangcheon and connects a residential district to '
          'a large park. Everything about the place is linear and in motion: people '
          'walking, cyclists passing, the river itself. The shelter is placed into '
          'that flow as the one thing that does not move — a place to stop, sit and '
          'stay, tucked into the leftover ground beneath the elevated road.'),
    ('fig', 1, 'The site where the elevated road, the river and the park meet. The '
               'shelter takes the residual ground underneath rather than claiming a '
               'new site.',
     'Aerial view of the site at Jungnangcheon with the elevated road and the circular shelter'),
    ('fig', 2, 'Seen closer, the shelter reads as a bowl set into the embankment, '
               'adding value to a space normally written off as under-bridge leftover.',
     'Close aerial view of the shelter set beneath the elevated road'),

    ('h', 'Homeostasis as a building principle'),
    ('p', 'Homeostasis is the ability of a living organism to hold a stable internal '
          'state while the world outside keeps changing. It is what lets life survive '
          'a changing environment. The shelter borrows the idea directly: rather than '
          'sealing the outside out, it keeps adjusting itself so that what reaches a '
          'person stays within a comfortable band.'),
    ('p', 'Six elements do the work. A kinetic roof sheds rain and regulates how much '
          'outside air comes through. Kinetic platforms rise and fall to meet the '
          'sun’s altitude. Rotatable panels decide how much light is reflected '
          'into the occupied space and how much is absorbed. A core carries '
          'circulation, a spiral stair joins the levels, and a retaining wall holds '
          'the ground.'),
    ('fig', 3, 'Arriving under the canopy. The section is tall and open at the ends, '
               'so the shelter never feels like an interior even while it is doing an '
               'interior’s work.',
     'Interior view looking through the shelter with the tensile roof overhead'),

    ('h', 'One room, four seasons'),
    ('p', 'The same room is tuned differently through the year. In winter the platform '
          'rises to follow a low sun and a high proportion of panels turn to reflect '
          'light inward. In spring and autumn the platform settles in the middle with '
          'only small adjustments. In summer it drops away from the sun and few panels '
          'reflect, letting the rest absorb the heat instead.'),
    ('fig', 4, 'The platforms read as green planes hung within the panelled bowl. '
               'Their height is the primary seasonal control.',
     'Section-like interior view showing the kinetic platforms and rotatable panels'),
    ('fig', 5, 'Mid-season position: the platform sits at the middle of its range and '
               'the panels are only partly turned.',
     'Interior view of the platforms occupied by visitors'),
    ('fig', 6, 'The panelled wall meets open sky at the rim. Comfort here is produced '
               'by adjustment, not by enclosure.',
     'Interior view toward the open rim of the shelter'),
    ('fig', 7, 'On the platform itself the space is flat, shaded and quiet — an '
               'outdoor floor behaving like an indoor one.',
     'View across a kinetic platform with people resting'),

    ('h', 'Stacked ground'),
    ('p', 'Because the platforms move, the shelter is read as several grounds stacked '
          'over one another rather than as floors in a building. The spiral stair and '
          'the core let people choose the level that suits the day, and the section '
          'stays open enough that you can always see the others.'),
    ('fig', 8, 'Levels overlap and stay visible to each other, so choosing a spot is '
               'also choosing a climate.',
     'Interior view showing overlapping platform levels and stairs'),
    ('fig', 9, 'The cellular wall gives every seat a slightly different exposure.',
     'Interior view of the cellular wall with seating'),

    ('h', 'Stenciled scenery'),
    ('p', 'The rotatable panels do more than manage heat. People and trees crossing '
          'Yongbi Bridge are caught on their surfaces and thrown back into the room, '
          'so the passing traffic of the bridge returns as a slow, stencilled image on '
          'the wall. The shelter keeps a deliberate dependence on its surroundings: '
          'the weather it moderates is also the thing it shows you.'),
    ('fig', 10, 'Looking up into the panels. The wall is a light instrument before it '
                'is a surface.',
     'View upward into the rotatable panel wall'),
    ('fig', 11, 'The spiral stair passes through the panelled wall, and the reflections '
                'shift with every step.',
     'Close view of the panel wall beside the spiral stair'),
    ('fig', 12, 'A single figure under the full sweep of the wall — the pause the whole '
                'project is built around.',
     'Wide interior view of the shelter with a single visitor'),
]

# ------------------------------------------------------------ Halfway Kitchen
STORIES['0A_12_verticalfarms'] = [
    ('lede', 'A vertical farm only makes sense where there is real demand for healthy '
             'food. The harder question is how a sealed, fully equipped growing machine '
             'is supposed to meet the neighbourhood it lands in. A Halfway Kitchen '
             'answers it by staying an incomplete platform: the farm keeps its original '
             'function, and invites the city in through a movie theatre and a food '
             'court.'),

    ('h', 'A machine that invites its context'),
    ('p', 'The site sits on South Broadway in Los Angeles, ringed by housing and a '
          'learning centre rather than by industry. Dropping a closed agricultural box '
          'here would produce a neighbour nobody has a reason to enter. So the building '
          'is deliberately left unfinished at its edges, and the parts that face the '
          'public are the familiar, approachable ones — a screen and a place to eat.'),
    ('fig', 1, 'The farm sits inside a residential block rather than on an industrial '
               'edge, which is what forces the question of how it meets its neighbours.',
     'Aerial view of the vertical farm within its Los Angeles residential block'),

    ('h', 'Introduced through a film'),
    ('p', 'Through the movie theatre the vertical farm is introduced without '
          'resistance. Sloping seating and a single screen compress the crowd into '
          'shared focus; afterwards the Passage of Lingering Impression draws visitors '
          'into a meditative walk that lets the film settle and quietly reframes '
          'appetite. Only then do they see and order food. The whole sequence — '
          'absorption, climax, lingering sway, a slow walk, the first bite — eases food '
          'cravings through immersion rather than instruction.'),
    ('fig', 3, 'The community theatre. One screen, one rake of seats, one shared '
               'direction of attention.',
     'The community theatre with sloping seating facing a single screen'),
    ('fig', 4, 'The Passage of Lingering Impression. The walk between film and food is '
               'the part of the building that changes how the meal is received.',
     'The passage lined with produce niches leading away from the theatre'),

    ('h', 'Lifted off the ground'),
    ('p', 'To get daylight down to the lower levels the growing volumes are hung as '
          'glass boxes on a sturdy vertical structure, which lifts the farm clear of '
          'the ground. What is left underneath becomes the dining place — an ordinary '
          'requirement turned into the most extraordinary room in the project.'),
    ('fig', 2, 'The cultivation tower. The farm keeps working at full capacity; none of '
               'its function is traded away for the public programme.',
     'Interior of the cultivation tower with stacked growing racks'),
    ('fig', 5, 'Dining beneath the farm, with the structure that carries it overhead.',
     'The dining area beneath the lifted vertical farm'),
    ('fig', 6, 'Ordering at the kiosk. Produce from directly above arrives as the '
               'ingredients on the menu.',
     'The menu pickup kiosk with planting and screens'),

    ('h', 'Docking, not tenanting'),
    ('p', 'The kitchens are not built in. Vendors bring their own food trucks, already '
          'equipped with their ingredients and tools, and dock at the farm; in return '
          'they get access to shared kitchen facilities and fresh produce. Each visit '
          'the food is healthy and also different, because the trucks change. Behind '
          'this sit the working rooms — cultivation, distribution, filter and hygiene '
          'labs, harvest processing and the docking station itself.'),
    ('fig', 7, 'Structure: factory-made square modules combining structure, MEP and '
               'envelope, hung from the vertical core.',
     'Axonometric drawing of the structural system'),
    ('fig', 11, 'The module unpacked. Building it as a repeated unit is what keeps the '
                'quality consistent.',
     'Exploded axonometric of the building module'),

    ('h', 'Water, in a dry city'),
    ('p', 'Los Angeles is dry, so rainwater is recycled rather than spent. Rain is '
          'collected on the roof and stored in a tank in the basement of the visitor '
          'building; when the crops need moisture it is fed back through pipes and '
          'ponds. Part of the tank is glazed, so visitors can see the thing working '
          'instead of being told about it.'),
    ('fig', 8, 'The environmental systems: rainwater harvesting, air, and the water '
               'supply that serves both agriculture and sprinklers.',
     'Axonometric diagram of the rainwater and environmental systems'),
    ('fig', 9, 'Site plan. The entrance plaza and the docking station face the street; '
               'the growing floors sit behind.',
     'Site plan of A Halfway Kitchen'),
    ('fig', 10, 'Lower level plan — dining, theatre, amphitheatre and the passage that '
                'joins them.',
     'Lower level plan showing the dining area and theatre'),
    ('fig', 12, 'Section through the farm and the public rooms beneath it.',
     'Section through the vertical farm and the dining level below'),
]

# ------------------------------------------------- Condensation for Compensation
STORIES['0A_13_condcomp'] = [
    ('lede', 'Seoul’s traffic problem is a scheduling problem. On weekdays everyone '
             'commutes inward to work; on weekends everyone drives outward to the city '
             'edge. The roads carry a full load in both directions. Meanwhile the Han '
             'River — a kilometre wide, connecting the metropolis horizontally to the '
             'countryside — stays famously underused.'),

    ('h', 'Move the home, not the person'),
    ('p', 'If a young household lives on the river beside its work, the weekday commute '
          'almost disappears. On Friday afternoon the home itself floats downriver to '
          'the outskirts; on Sunday evening it returns to the Han River port nearest '
          'the workplace and prepares for the week. The traffic is not managed. It is '
          'simply not generated.'),
    ('fig', 3, 'Homes on the water between the bridges. The river becomes the '
               'infrastructure it already was, in a different direction.',
     'View of the floating homes on the Han River with the city skyline beyond'),

    ('h', 'Condensation, on weekdays'),
    ('p', 'In the city the unit stays closed. Condensed, it still holds everything a '
          'home needs — a wet unit with bathroom and kitchen, a rest unit, and an entry '
          'unit the occupant configures to taste. The result is a complete, convenient '
          'rest at the end of a long weekday rather than a compromise.'),
    ('fig', 1, 'The condensed unit, cut open. Everything essential is present before '
               'anything expands.',
     'Cutaway axonometric of the condensed floating home'),
    ('fig', 4, 'Inside, the circular section makes a small space feel settled rather '
               'than tight.',
     'Interior of the unit with a circular window facing the river'),

    ('h', 'Compensation, at the weekend'),
    ('p', 'Arriving at a rural port, the unit docks, takes on clean energy and water, '
          'discharges its waste, and is expanded with the help of a forklift. The '
          'extended unit supports everything that needs room — the compensation for a '
          'week spent condensed.'),
    ('fig', 2, 'Expanded on the bank. The same home, opened out for two days.',
     'Axonometric of the expanded unit on a rural riverbank'),
    ('fig', 5, 'The docking station: servicing, expansion and mooring in one piece of '
               'shoreline infrastructure.',
     'Axonometric of the riverside docking station'),

    ('h', 'Built as a boat'),
    ('p', 'The unit is resolved as a vessel, not as a room that floats. A displacement '
          'hull makes movement smoother, a bulb keel keeps it balanced, and a '
          'transformable sail on rotatable ribs adds stability when parked and sheds '
          'wind resistance when moving. Under the wet unit a system slab carries the '
          'MEP, supplying air, water and electricity and holding waste until the next '
          'dock.'),
    ('fig', 6, 'The full assembly: sail, shell, the three body units, system slab, hull '
               'and keel.',
     'Exploded component diagram of the floating home'),
]

# -------------------------------------------------------- Uptown Runway (2022)
STORIES['0A_14_uptownrunwayorigin'] = [
    ('lede', 'Clothes are already recycled four ways — fibre, fabric, donation and '
             'resale — but each is run by a different party, in a different place. The '
             'process is broken into pieces that never see one another. This project '
             'puts all four back inside a single neighbourhood, so that the stages '
             'connect and residents can take part in them.'),

    ('h', 'The arithmetic of a neighbourhood'),
    ('p', 'Junggye 2·3-dong, Hagye 1-dong and Hagye 2-dong discard about 2.69 tons of '
          'clothing every day. Handling that within the neighbourhood instead of '
          'hauling it across the city cuts logistics from 51.59 to 3.22 t·km per day, '
          'and the carbon that goes with it. The four streams are sized accordingly: '
          'C2C reuse 30%, B2B reuse 25%, upcycling design 15%, fibre recycling 15%.'),
    ('fig', 2, 'Site and catchment. The project begins from how much clothing this '
               'particular set of blocks throws away.',
     'Site analysis map with population and discard calculations'),
    ('fig', 3, 'Existing methods against the optimised system: the same four processes, '
               'relocated into one neighbourhood unit.',
     'Diagram comparing existing recycling methods with the optimised system'),

    ('h', 'Four solids, in order of difficulty'),
    ('p', 'Each stream gets its own building, and the four are arranged in order of '
          'decreasing ease of disassembly — from the community market where a garment '
          'changes hands whole, through vintage boutiques and designers’ studios, '
          'to the fibre recycling factory where it is broken down completely. A garment '
          'moves through the site as it loses its original form.'),
    ('fig', 4, 'The four buildings and their internal circulation, one per process.',
     'Axonometric diagrams of the four buildings and their circulation'),
    ('fig', 5, 'Plan of the complex, with the four solids and the spaces between them.',
     'Plan of the four buildings'),
    ('fig', 6, 'The masses set out along the site.',
     'Plan and massing of the three principal volumes'),
    ('fig', 7, 'Sections through the sequence, showing how the ground steps between '
               'buildings.',
     'Four stacked sections through the complex'),

    ('h', 'A stage that ties them together'),
    ('p', 'A public stage links the four buildings, giving physical and visual access '
          'across the whole process. It also does something quieter: it makes the '
          'crowds already in Junggye Park aware of the building across the street. '
          'Recycling stops being a service performed elsewhere and becomes something '
          'visible from the park bench.'),
    ('fig', 1, 'The complex seen from the park, with the stage joining the volumes.',
     'Exterior view of the complex from the park across the street'),
    ('fig', 8, 'The public passage through the site.',
     'Interior public passage with a reflecting pool'),
    ('fig', 9, 'Terraces between the buildings, where the process is on view.',
     'Exterior terrace between the buildings with visitors'),

    ('h', 'Voids that show their work'),
    ('p', 'Between the solids sit three voids, and their façades are made of the '
          'material the building handles. The commercial void uses unsold clothing as '
          'it is; the cultural void uses re-manufactured yarn. Recycled fabric gives '
          'each void a distinct character, and the envelope explains the programme '
          'without a sign.'),
    ('fig', 10, 'A void between two solids, glazed and lined with recycled fabric.',
     'Interior corridor between the buildings'),
    ('fig', 11, 'The cultural void, where people gather on the steps.',
     'Interior atrium with people seated on steps'),
    ('fig', 12, 'The community market, the point where a garment is still a garment.',
     'Interior of the community market with a timber ceiling'),
]

# ------------------------------------------------------------ Yujin Mansions
STORIES['0A_15_yujinmansions'] = [
    ('lede', 'Yujin Mansion is two buildings in one: a shopping centre on the ground '
             'floor and housing above, sitting under an elevated highway. The location '
             'that makes it poor housing makes it good commercial ground. The project '
             'takes that seriously — Yujin Mansion becomes Yujin MansionS.'),

    ('h', 'What was going wrong'),
    ('p', 'The indoor market had been declining for years, its customer base fixed by '
          'an ageing local population and its sales falling to roughly half. The '
          'residential units were too large for the residents left in them, and the '
          'conditions under the overpass were poor. Part of the building had already '
          'been demolished. The site had been through two rounds of urban regeneration '
          'without the underlying mismatch being addressed.'),
    ('p', 'Rather than chase the existing customers, the project aims at two groups '
          'already passing: people shopping at Inwang market, and people walking along '
          'Hongjecheon. The commercial programme is revived, and food and beverage, '
          'fitness and exhibition are made to coexist with it.'),
    ('fig', 1, 'The building after division — the long mass split into separate '
               'volumes with public ground between them.',
     'Exterior view of the divided masses of Yujin Mansions'),

    ('h', 'Cutting alleys into a 200-metre building'),
    ('p', 'The site is over 200 metres long, and the long spaces that follow from it '
          'seemed worth keeping. So instead of subdividing across, the existing mass is '
          'divided lengthwise to form alleys. Programmes that had been stacked '
          'vertically and kept apart are reorganised into four parallel alleys, each '
          'holding its own function.'),
    ('fig', 2, 'Long section through the building and the stream below.',
     'Long section through Yujin Mansions'),
    ('fig', 3, 'The programme bands set along the length of the site.',
     'Axonometric of the building showing programme bands'),
    ('fig', 4, 'Ground and basement plans: as-is, alleys made, alleys connected.',
     'Ground floor and basement plans showing the alley strategy'),

    ('h', 'Four alleys, four structures'),
    ('p', 'Each alley needs something different, so the structural reinforcement that '
          'creates it is tuned to match. The commercial alley uses a dense grid to '
          'carry many small tenants. The fitness alley has walls with openings for '
          'natural ventilation. The exhibition alley keeps openings to a minimum for '
          'immersion. The food and beverage alley uses a comfortable long-span grid.'),
    ('fig', 5, 'The commercial alley, with its dense grid of tenancies.',
     'The commercial alley with shoppers'),
    ('fig', 6, 'The fitness alley, opened for ventilation and crossed by bridges.',
     'The fitness alley with bridges and planting'),
    ('fig', 7, 'The exhibition alley, kept dark and narrow for immersion.',
     'The narrow exhibition alley'),

    ('h', 'From the stream to the sky'),
    ('p', 'The alleys are cut vertically as well as horizontally. They open the view '
          'from the basement level, where Hongjecheon runs, all the way up to the sky — '
          'which is what makes a building pinned under an overpass feel comfortable to '
          'stand in.'),
    ('fig', 8, 'The food and beverage alley, lit from above and open along its length.',
     'The food and beverage alley with diners and market signage'),
]

# ---------------------------------------------------------------- Dining Way
STORIES['0A_16_diningway'] = [
    ('lede', 'As single-person households increase, food delivery increases with them, '
             'and the environmental and health costs follow. The alternative this '
             'project proposes is architectural rather than behavioural: make a place '
             'where food is eaten where it is made, and make going there worth the '
             'walk.'),

    ('h', 'Eating alone, together'),
    ('p', 'The site lies between Seongsu and Konkuk University, surrounded by dense '
          'housing full of young single-person households. Gathering solo diners in one '
          'room creates its own fatigue — the tiring, unnecessary social contact of '
          'being alone in public. So the restaurant is crossed with a gallery: visitors '
          'have art to attend to while they eat, and being alone becomes the ordinary '
          'condition of the place rather than a conspicuous one.'),
    ('fig', 1, 'The courtyard the whole sequence hangs from.',
     'Exterior view of the Dining Way courtyard'),
    ('fig', 2, 'Programme diagram: support kitchens and markets around a courtyard, '
               'with the eating route above.',
     'Axonometric programme diagram of Dining Way'),

    ('h', 'A meal laid out as a walk'),
    ('p', 'The building is organised as a promenade, and the courses are distributed '
          'along it. The uphill promenade carries appetisers, set beside art pieces of '
          'a similar temper and free to eat as you move. At the top is the meal pick-up '
          'and return area, connected vertically to the cold kitchen below by dumb '
          'waiter, where the main dish is collected and eaten sitting — reading, or '
          'watching. The downhill promenade holds dessert, alongside rooms for painting '
          'and sculpture where visitors make something themselves.'),
    ('fig', 3, 'The promenade masses stepping along the slope, course by course.',
     'Axonometric of the promenade volumes along the site'),
    ('fig', 4, 'Long section through the uphill route, the top, and the descent.',
     'Long section through the promenade'),

    ('h', 'Cook, or be cooked for'),
    ('p', 'Below the promenade sit the support programmes: a dish library, shared '
          'kitchens of both restaurant and citizen type, a grocery market, an artist '
          'studio, and the cold and hot kitchens. Visitors can cook for themselves — '
          'through the market and the shared kitchen — or order from a kitchen tenant. '
          'Either way the food travels vertically by dumb waiter, so plates reach the '
          'promenade without cutting across the walk.'),
    ('fig', 5, 'The uphill promenade, where appetisers sit beside the work on show.',
     'Interior of the uphill promenade with tables'),
    ('fig', 6, 'The top of the route, where the main dish is picked up and returned.',
     'Interior at the top of the promenade with stairs'),
    ('fig', 7, 'A dining room along the descent, open to the courtyard.',
     'Interior dining space along the downhill promenade'),
    ('fig', 8, 'The building at the end of the day, still open to the street.',
     'Exterior view of Dining Way in the evening'),
]

# -------------------------------------------------------- Uptown Runway (2025)
# 포트폴리오에 실린 프로젝트. 2022년 판과 논지가 같으므로 문단도 같이 간다.
# 그림만 이 페이지의 도면에 맞춰 배치한다.
STORIES['0A_17_uptownrunway'] = [
    ('lede', 'Clothes are already recycled four ways — fibre, fabric, donation and '
             'resale — but each is run by a different party, in a different place. The '
             'process is broken into pieces that never see one another. This project '
             'puts all four back inside a single neighbourhood, so that the stages '
             'connect and residents can take part in them.'),

    ('h', 'The arithmetic of a neighbourhood'),
    ('p', 'Junggye 2·3-dong, Hagye 1-dong and Hagye 2-dong discard about 2.69 tons of '
          'clothing every day. Handling that within the neighbourhood instead of '
          'hauling it across the city cuts logistics from 51.59 to 3.22 t·km per day, '
          'and the carbon that goes with it. The four streams are sized accordingly: '
          'C2C reuse 30%, B2B reuse 25%, upcycling design 15%, fibre recycling 15%.'),
    ('fig', 1, 'The building on its street, held to the scale of the blocks it serves. '
               'Keeping the process here is what removes the haulage.',
     'Street view of Uptown Runway among the surrounding apartment blocks'),
    ('fig', 2, 'The neighbourhood the figures come from, read as figure and ground.',
     'Figure-ground map of the neighbourhood'),
    ('fig', 3, 'Site plan, with the park edge and the approach to the building.',
     'Site plan showing the building and the adjacent park'),

    ('h', 'Ordered by how far a garment has fallen'),
    ('p', 'The four streams are arranged in order of decreasing ease of disassembly — '
          'from the community market, where a garment changes hands whole, through '
          'vintage resale and the designers who redesign it, to fibre recycling where '
          'it is broken down completely. A garment moves through the building as it '
          'loses its original form, and the visitor route follows the same descent.'),
    ('fig', 4, 'Donation and fitting at the entrance: the first act of the system is '
               'something a visitor performs rather than watches.',
     'The donation and fitting hall at the building entrance'),
    ('fig', 5, 'Resale and repair stacked in section, with escalators crossing between '
               'the levels.',
     'Multi-level interior with resale and repair floors'),
    ('fig', 10, 'The atrium, with garments hung through its full height.',
     'The atrium with garments suspended overhead'),
    ('fig', 6, 'Looking down through the atrium — each stage stays visible from the '
               'ones above and below it.',
     'View down into the atrium from an upper level'),

    ('h', 'The last stage, kept in view'),
    ('p', 'Fibre recycling is the end of the line and the least presentable part of '
          'the process, so it is the part most systems hide. Here it is given the same '
          'daylight and the same glazing as the shops. A system that asks for citizen '
          'participation cannot keep half of itself out of sight.'),
    ('fig', 7, 'The processing floor, with conveyors running alongside the public '
               'route.',
     'Interior of the processing floor with conveyors and garments'),
    ('fig', 8, 'Plan of the working levels.',
     'Plan of the processing levels'),
    ('fig', 9, 'Plan at ground level, with the landscape around the building.',
     'Ground level plan with the surrounding landscape'),

    ('h', 'Voids that show their work'),
    ('p', 'Between the solids sit the voids, and their façades are made of the material '
          'the building handles. The commercial void uses unsold clothing as it is; the '
          'cultural void uses re-manufactured yarn. Recycled fabric gives each void a '
          'distinct character, so the envelope explains the programme without a sign.'),
    ('fig', 11, 'The glazed alley cut through the building, giving the neighbourhood a '
                'way across the site and a view into the process on both sides.',
     'The glazed alley running through the building'),
    ('fig', 12, 'Façade section through the alley wall.',
     'Facade section detail'),
    ('fig', 13, 'At the ground the building opens back onto the street — less a plant '
                'than a covered piece of the neighbourhood that recycles what it wears.',
     'Street level view beneath the building with pedestrians'),
]
