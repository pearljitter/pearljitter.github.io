/*
 * 아카이브에 실린 작업 목록. 세 가지 보기가 모두 이 배열 하나를 쓴다.
 *
 * coords 는 (구체성, 규모, 진지함).
 *   x  -  = 추상   +  = 구체
 *   y  -  = 작음   +  = 큼
 *   z  -  = 유쾌   +  = 진지
 *
 * thumb 번호는 이 배열의 순서를 따른다. 순서를 바꾸면
 * tools/make_project_thumbs.py 를 다시 돌려 썸네일 번호를 맞춰야 한다.
 */
window.WORKS = [
    ['FUZZY UNIVERSE', 'Interactive Sketch', 'Object Exercise', '11.09.23', '0G_1_fuzzy.html', [-6, 5, -3]],
    ['CHUNKING RUN', 'Flash Game', 'A Sequel of a Trip to Hong Kong', '01.01.24', '0G_2_chunking.html', [2, -3, -4]],
    ['STRAGGLER CARRIER', 'Flash Game', 'A Sequel of a Trip to JungSeon', '11.02.24', '0G_3_ski.html', [1, -1, -3]],
    ['ORIGAMI DRAGON', 'Interactive Sketch', 'Mouse Interaction Exercise', '01.08.20', '0G_4_dragon.html', [-2, -5, 1]],
    ['GALAGA', 'Flash Game', 'Arcade Game Exercise', '11.09.20', '0G_5_galaga.html', [1, 5, 1]],
    ['PACGUY', 'Flash Game', 'Arcade Game Exercise', '29.09.20', '0G_6_pacguy.html', [0, -4, -4]],
    ['GATHER', 'Interactive Sketch', 'Gravity Exercise', '14.04.24', '0G_7_gather.html', [-5, 6, -2]],
    ['TANGHULU', 'Interactive Sketch', 'Object Exercise', '11.09.10', '0G_8_tanghulu.html', [-4, -6, -5]],
    ['THOUGHTS', 'Text', '', '27.01.25~', '0T_9_blog.html', [0, 0, 0]],
    ['VIRTUAL ESSENCE', 'Series of Interactive Sketches', '', '06.12.24~', '0G_10_virtualEssence.html', [3, 0, 5]],
    ['A SHELTER OF HOMEOSTASIS', 'Architecture', "A sustainable alternative to an 'idealized nature'", '21.11.24', '0A_11_homeostasis.html', [6, -2, 6]],
    ['READER', 'Interactive Sketch', '', '09.03.25', '0G_12_reader.html', [6, 0, 2]],
    ['PEOPLE', 'Interactive Sketch', '', '01.02.25', '0G_13_people.html', [7, -5, 4]],
    ['A HALFWAY KITCHEN', 'Architecture', 'A vertical farm for food truck docking', '21.05.25', '0A_12_verticalfarms.html', [7, 6, 6]],
    ['CONDENSATION FOR COMPENSATION', 'Architecture', 'Mobile home for metropolitan Seoul', '15.01.24', '0A_13_condcomp.html', [6, -6, 4]],
    ['UPTOWN RUNWAY', 'Architecture', 'Neighborhood garment recycling infrastructure', '23.09.22', '0A_14_uptownrunwayorigin.html', [4, 3, 6]],
    ['YUJIN MANSIONS', 'Architecture', 'Yujin Mansion revitalization', '21.12.21', '0A_15_yujinmansions.html', [5, 7, 6]],
    ['DINING WAY', 'Architecture', 'An exclusive food center for singles', '20.06.21', '0A_16_diningway.html', [5, 2, 5]],
    ['UPTOWN RUNWAY', 'Architecture', 'Neighborhood garment recycling infrastructure', '19.11.25', '0A_17_uptownrunway.html', [7, 3, 6]]
].map(function (row, i) {
    var url = row[4];
    return {
        index: i + 1,
        title: row[0],
        kind: row[1],
        note: row[2],
        date: row[3],
        url: url,
        coords: row[5],
        thumb: 'thumbnail/' + (i + 1) + '.jpg',
        isArchitecture: url.indexOf('0A_') === 0
    };
});
