/**
 * 本文件包含百度地图相关配置代码，调用了百度地图的API
 */


// 地图实例
var bmap = null;


// LocalSearch(原在线版使用)
var local = null;


// Mapv外来人口图层
var mapvOutsiderLayer = null;


// Mapv犯罪预测图层
var mapvCrimePredictLayer = null;

// Mapv摄像头图层
var mapvCameraLayer = null;


// 公安局派出所数据(离线地图时的警徽标记)
var localSearchData = [
    [116.557913, 39.971966, "北京市公安局朝阳分局东坝派出所", "地址：红松园北里8号", "坐标：116.557913,39.971966"],
    [116.478897, 40.014113, "北京市公安局朝阳分局东湖派出所", "地址：北京市朝阳区望京花园130楼", "电话：010-64713294", "坐标：116.478897,40.014113"],
    [116.502669, 39.923031, "北京市公安局朝阳分局八里庄派出所", "地址：十里堡西里218", "电话：(010)65561089 ", "坐标：116.502669,39.923031"],
    [116.598163, 40.065637, "北京首都国际机场公安分局货运区派出所", "地址：首都机场航安路12号", "坐标：116.598163,40.065637"],
    [116.553928, 40.04487, "北京市公安局朝阳分局孙河派出所", "地址：孙河乡康营村康营东路", "电话：(010)64384569", "坐标：116.553928,40.04487"],
    [116.549249, 39.912142, "北京市公安局朝阳分局高碑店派出所", "地址：高碑店乡高碑店村252号 ", "电话：(010)85754153 ", "坐标：116.549249,39.912142"],
    [116.509963, 40.045388, "北京市公安局朝阳分局崔各庄派出所", "地址：北京市朝阳区马泉营西路6号 ", "电话：010-64320110 ", "坐标：116.509963,40.045388"],
    [116.419473, 40.032832, "奥运村街道综治维稳工作中心", "地址：安立路28号院-3-4 ", "坐标：116.419473,40.032832"],
    [116.415922, 39.992993, "朝阳公安分局亚运村派出所安苑里社区派出所", "地址：北京市朝阳区安苑北里9号 ", "坐标：116.415922,39.992993"],
    [116.42947, 39.994561, "北京市公共交通安全保卫分局小营派出所", "地址：北京市朝阳区北四环东路104号", "电话：(010)64918548 ", "坐标：116.42947,39.994561"],
    [116.422375, 39.991588, "奥林匹克公园派出所", "地址：朝阳区小关街道惠新西街9号惠新苑3号楼  ", "坐标：116.422375,39.991588"],
    [116.417056, 39.990522, "北京市公安局公安交通管理局朝阳交通支队亚运村大队", "地址：安苑北里24号", "电话：010-68399551,010-64912336", "坐标：116.417056,39.990522"],
    [116.537125, 39.930849, "北京市公安局朝阳分局平房派出所", "地址：黄杉木店路10号 ", "电话：(010)85574138", "坐标：116.537125,39.930849"],
    [116.493274, 39.929935, "北京市公安局朝阳分局-办证大厅", "地址：道家园1号 ", "坐标：116.493274,39.929935"],
    [116.49338, 39.930028, "北京市公安局朝阳分局", "地址：道家园1号  ", "坐标：116.49338,39.930028"],
    [116.43081, 39.979558, "北京市公安局朝阳分局和平街派出所", "地址：樱花园东街3号  ", "电话：(010)64429007", "坐标：116.43081,39.979558"],
    [116.445592, 39.977861, "北京市公安局朝阳分局太阳宫派出所", "地址：北京市朝阳区西坝河北里39号  ", "电话：010-84253775 ", "坐标：116.445592,39.977861"],
    [116.402851, 39.976657, "北京市公安局朝阳分局安贞里派出所", "地址：安贞西里三区7号楼  ", "电话：(010)64419129 ", "坐标：116.402851,39.976657"],
    [116.578635, 39.876479, "北京市公安局朝阳分局豆各庄派出所", "地址：豆各庄乡豆各庄村518号  ", "坐标：116.578635,39.876479"],
    [116.501749, 39.901518, "北京市公安局公安交通管理局朝阳交通支队", "地址：北京市朝阳区  ", "坐标：116.501749,39.901518"],
    [116.493203, 39.893007, "北京市公安局朝阳分局劲松派出所", "地址：北京市朝阳区大郊亭南街9号院1号楼  ", "电话：010-67727306 ", "坐标：116.493203,39.893007"],
    [116.489789, 39.889805, "南磨房派出所", "地址：平乐园小区105号楼 ", "电话：010-67312979 ", "坐标：116.489789,39.889805"],
    [116.500485, 39.85801, "直属派出所", "地址：北京市朝阳区 ", "坐标：116.500485,39.85801"],
    [116.442219, 39.842178, "最高人民法院人民来访接待室暨申诉立案大厅", "地址：北京市朝阳区小红门乡红寺村40号 ", "坐标：116.442219,39.842178"],
    [116.604184, 40.053442, "北京市公安局朝阳分局首都机场派出所", "地址：首都机场燕翔东里12号  ", "电话：(010)64561626 ", "坐标：116.604184,40.053442"],
    [116.559785, 39.914499, "北京市公安局朝阳分局三间房派出所", "地址：建国路22 ", "电话：(010)65420110 ", "坐标：116.559785,39.914499"],
    [116.586281, 39.930633, "朝阳区公安局预审处", "地址：朝阳北路29号 ", "坐标：116.586281,39.930633"],
    [116.538844, 40.00587, "北京市公安局黑桥地区直属派出所", "地址：北京市朝阳区 ", "电话：(010)52005258 ", "坐标：116.538844,40.00587"],
    [116.471444, 39.992736, "北京市公安局朝阳分局花家地派出所", "地址：花家地北里208 ", "电话：010-84716378,84716376 ,84716377 ", "坐标：116.471444,39.992736"],
    [116.469176, 40.00445, "北京市公安局朝阳分局南湖派出所", "地址：南湖中园238号", "电话：(010)64703003 ", "坐标：116.469176,40.00445"],
    [116.439878, 40.002606, "北京市公安局公共交通安全保卫分局大屯站派出所", "地址：鼎成西路附近 ", "电话：(010)84618802 ", "坐标：116.439878,40.002606"],
    [116.413156, 39.99109, "亚运村治安派出所", "地址：安定路1号 ", "电话：(010)64910162 ", "坐标：116.413156,39.99109"],
    [116.427252, 40.007958, "北京市公安局朝阳分局大屯派出所", "地址：北京市朝阳区大屯220号院6 ", "电话：(010)64949248 ", "坐标：116.427252,40.007958"],
    [116.394556, 39.992979, "中华民族园治安办公室", "地址：民族园路1  ", "坐标：116.394556,39.992979"],
    [116.502916, 39.970225, "北京市公安局朝阳分局酒仙桥派出所", "地址：酒仙桥南路9号", "电话：(010)64371415 ", "坐标：116.502916,39.970225"],
    [116.509569, 39.985258, "北京市公安局朝阳分局将台派出所", "地址：北京市朝阳区驼房营路 ", "电话：(010)64362030 ", "坐标：116.509569,39.985258"],
    [116.536109, 39.912854, "北京市公安局高碑店派出所", "地址：北京市朝阳区 ", "坐标：116.536109,39.912854"],
    [116.511534, 39.934866, "北京市公安局朝阳分局六里屯派出所", "地址：十里堡1号院 ", "电话：(010)85817657 ", "坐标：116.511534,39.934866"],
    [116.490795, 39.908691, "北京东站公安派出所", "地址：百子湾路7号附近 ", "坐标：116.490795,39.908691"],
    [116.493945, 39.929821, "北京市公安局朝阳分局治安支队", "地址：道家园1号 ", "坐标：116.493945,39.929821"],
    [116.492484, 39.906736, "北京铁路公安局北京公安处北京东车站派出所", "地址：三间房百子湾路 ", "坐标：116.492484,39.906736"],
    [116.473413, 39.934036, "北京市公安局朝阳分局团结湖派出所", "地址：团结湖路19 ", "电话：(010)85989395 ", "坐标：116.473413,39.934036"],
    [116.437682, 39.981357, "北京市朝阳分局和平街派出所辅警中队", "地址：北京市朝阳区 ", "坐标：116.437682,39.981357"],
    [116.445125, 39.975757, "朝阳公安分局巡警支队", "地址：西坝河北里8号 ", "坐标：116.445125,39.975757"],
    [116.387041, 39.989606, "祁家豁子长途客运派出所", "地址：华严北里甲30号 ", "坐标：116.387041,39.989606"],
    [116.450712, 39.936879, "朝阳公安分局工人体育场派出所", "地址：北京工人体育场西门内  ", "电话：(010)65022662 ", "坐标：116.450712,39.936879"],
    [116.538462, 39.881179, "北京市公安局朝阳分局王四营派出所", "地址：王四营3号  ", "电话：010-67364358", "坐标：116.538462,39.881179"],
    [116.51848, 39.873961, "北京市公安局朝阳分局垡头派出所", "地址：垡头北里12号楼 ", "电话：(010)67381152 ", "坐标：116.51848,39.873961"],
    [116.489963, 39.859169, "北京市公安局十八里店派出所", "地址：北京市朝阳区 ", "坐标：116.489963,39.859169"],
    [116.462805, 39.898394, "北京市公安局朝阳分局双井派出所", "地址：垂杨柳中街2号 ", "电话：(010)67716244,010-67716495,010-87771010 ", "坐标：116.462805,39.898394"],
    [116.461534, 39.880294, "北京市公安局朝阳分局潘家园派出所", "地址：潘家园路甲1号 ", "电话：(010)67785877 ", "坐标：116.461534,39.880294"],
    [116.533664, 39.844256, "北京市公安局朝阳分局小武基派出所", "地址：北京市朝阳区王村路 ", "电话：010-87335298,010-87335927", "坐标：116.533664,39.844256"],
    [116.575971, 40.009939, "北京市公安局朝阳分局金盏派出所", "地址：金盏乡金盏大街 ", "电话：(010)84333271 ", "坐标：116.575971,40.009939"],
    [116.462805, 39.898394, "楼梓庄派出所", "地址：楼梓庄乡楼梓庄村", "电话：(010)67716244,010-67716495,010-87771010 ", "坐标：116.462805,39.898394"],
    [116.603106, 39.915457, "杨闸派出所", "地址：京通快速路附近", "坐标：116.603106,39.915457"],
    [116.503843, 40.063756, "北京市公安局朝阳分局黄港派出所", "地址：北京市朝阳区上辛堡458号", "电话：(010)84791728", "坐标：116.503843,40.063756"],
    [116.520492, 40.00629, "北京市公安局朝阳分局南皋派出所", "地址：南皋村路口东南100米", "电话：(010)84566383", "坐标：116.520492,40.00629"],
    [116.520634, 39.997101, "北京公安处环行铁道派出所", "地址：北京市朝阳区庄园西路西200米", "电话：010-51896911", "坐标：116.520634,39.997101"],
    [116.452812, 40.034717, "北京市公安局朝阳分局来广营派出所", "地址：北京市朝阳区来广营朝来农艺园", "电话：(010)84912670", "坐标：116.452812,40.034717"],
    [116.417946, 40.004973, "公安派出所", "地址：北京市朝阳区", "坐标：116.417946,40.004973"],
    [116.416678, 39.99373, "北京市公安局朝阳分局亚运村派出所", "地址：安苑北里甲8", "电话：(010)64912192", "坐标：116.416678,39.99373"],
    [116.419876, 40.029954, "北京市公安局朝阳分局奥运村派出所", "地址：拂林路甲9", "电话：(010)84917506", "坐标：116.419876,40.029954"],
    [116.506624, 39.953253, "北京市公安局东风派出所", "地址：北京市小辛庄甲12号", "电话：(010)85849101", "坐标：116.506624,39.953253"],
    [116.457958, 39.955093, "北京市公安局朝阳分局新源里派出所", "地址：新源里17号", "电话：(010)64674086", "坐标：116.457958,39.955093"],
    [116.443423, 39.967066, "北京市公安局朝阳分局香河园派出所", "地址：西坝河南里26号楼", "电话：(010)64660050", "坐标：116.443423,39.967066"],
    [116.41907, 39.98371, "北京市公安局朝阳分局小关派出所", "地址：小关东街5号节能中心旁边", "电话：(010)64917134", "坐标：116.41907,39.98371"],
    [116.444968, 39.924374, "北京市公安局朝阳分局朝外大街派出所", "地址：朝阳门外三丰里甲11号", "电话：(010)85612407", "坐标：116.444968,39.924374"],
    [116.604224, 39.859452, "北京市公安局朝阳分局黑庄户派出所", "地址：北京市朝阳区黑庄户路", "电话：(010)85382586", "坐标：116.604224,39.859452"],
    [116.52391, 39.871438, "王四营派出所", "地址：北京市朝阳区陶庄路120号", "坐标：116.52391,39.871438"],
    [116.500535, 39.858058, "北京市公安局老君堂地区直属派出所", "地址：朝阳区小武基村双馨实验学校北侧", "坐标：116.500535,39.858058"],
    [116.464151, 39.847314, "北京市公安局朝阳分局小红门派出所", "地址：朝阳区小红门四环内小红门路龙爪树南里142号院5号楼军休办", "电话：(010)87690144 ", "坐标：116.464151,39.847314"],
    [116.461985, 39.918461, "北京市公安局朝阳分局建国门外派出所", "地址：东三环光华路光华里甲2号", "电话：010-65084102,65025557", "坐标：116.461985,39.918461"],
    [116.579019, 39.906338, "北京市公安局朝阳分局双桥车站派出所", "地址：北京市朝阳区", "电话：(010)65761772", "坐标：116.579019,39.906338"],
    [116.610529, 39.908067, "北京市公安局朝阳分局管庄派出所", "地址：双会桥西甲5号", "电话：(010)65761888", "坐标：116.610529,39.908067"],
    [116.460125, 39.941686, "北京市公安局朝阳分局三里屯派出所", "地址：三里屯南41号 ", "电话：(010)64166786 ", "坐标：116.460125,39.941686"],
    [116.47974, 39.953064, "北京市公安局朝阳分局麦子店派出所", "地址：枣营北里1号", "电话：(010)65063295", "坐标：116.47974,39.953064"]
];

var cameraLocationData=[
    {id:"218700","location":"京朝凯宾斯基酒店西侧燕莎桥东南角","type":"高清探头","range":300,"lng":116.468299,"lat":39.954188,"minLng":116.46478372103988,"minLat":39.95149333425505,"maxLng":116.47181427896012,"maxLat":39.95688266574496},
    {id:"218701","location":"京朝燕莎商城西南角三环辅路边","type":"高清探头","range":300,"lng":116.469513,"lat":39.954469,"minLng":116.46599770659697,"minLat":39.951774334255056,"maxLng":116.47302829340306,"maxLat":39.95716366574496},
    {id:"218702","location":"京朝凯宾斯基酒店西门东侧100米","type":"高清探头","range":300,"lng":116.472623,"lat":39.955028,"minLng":116.46910767786474,"minLat":39.952333334255044,"maxLng":116.47613832213526,"maxLat":39.95772266574495},
    {id:"218703","location":"京朝凯宾斯基酒店西门西侧100米","type":"高清探头","range":300,"lng":116.469955,"lat":39.95462,"minLng":116.46643969883577,"minLat":39.95192533425505,"maxLng":116.4734703011643,"maxLat":39.95731466574497},
    {id:"218704","location":"京朝凯宾斯基酒店南侧绿化带","type":"高清探头","range":300,"lng":116.464484,"lat":39.949123,"minLng":116.46096898133725,"minLat":39.946428334255046,"maxLng":116.46799901866277,"maxLat":39.95181766574496},
    {id:"218705","location":"京朝燕莎商城南侧停车场东部","type":"高清探头","range":300,"lng":116.471018,"lat":39.954089,"minLng":116.46750272612825,"minLat":39.95139433425505,"maxLng":116.47453327387173,"maxLat":39.956783665744965},
    {id:"218706","location":"京朝燕莎商城南侧停车场中部","type":"高清探头","range":300,"lng":116.470263,"lat":39.953916,"minLng":116.46674773502,"minLat":39.951221334255045,"maxLng":116.47377826498001,"maxLat":39.956610665744954},
    {id:"218707","location":"京朝凯宾斯基酒店南侧亮马河北岸桥头往东100米","type":"高清探头","range":300,"lng":116.472563,"lat":39.954255,"minLng":116.4690477175962,"minLat":39.95156033425505,"maxLng":116.47607828240379,"maxLat":39.95694966574496},
    {id:"218708","location":"京朝凯宾斯基酒店南侧亮马河北岸桥头","type":"高清探头","range":300,"lng":116.470892,"lat":39.953861,"minLng":116.46737673784685,"minLat":39.95116633425504,"maxLng":116.47440726215315,"maxLat":39.95655566574496},
    {id:"218709","location":"京朝凯宾斯基酒店南侧亮马河北岸桥头往西100米","type":"高清探头","range":300,"lng":116.469733,"lat":39.953653,"minLng":116.4662177485374,"minLat":39.950958334255056,"maxLng":116.47324825146265,"maxLat":39.956347665744964},
    {id:"218710","location":"京朝亮马桥路和燕莎东路交叉口西南角向南","type":"高清探头","range":300,"lng":116.474197,"lat":39.955862,"minLng":116.47068163499621,"minLat":39.95316733425505,"maxLng":116.47771236500381,"maxLat":39.95855666574496},
    {id:"218711","location":"京朝四季酒店西北角向东100米向西","type":"高清探头","range":300,"lng":116.47259,"lat":39.956177,"minLng":116.46907461880433,"minLat":39.953482334255035,"maxLng":116.47610538119567,"maxLat":39.95887166574496},
    {id:"218712","location":"京朝四季酒店西北角向东100米向东","type":"高清探头","range":300,"lng":116.474781,"lat":39.95673,"minLng":116.4712655903781,"minLat":39.954035334255046,"maxLng":116.47829640962192,"maxLat":39.95942466574496},
    {id:"218713","location":"京朝麦子店街与亮马桥路交叉口西南角向东","type":"高清探头","range":300,"lng":116.475011,"lat":39.956965,"minLng":116.47149557829799,"minLat":39.954270334255035,"maxLng":116.47852642170201,"maxLat":39.95965966574496},
    {id:"218714","location":"京朝麦子店街与亮马桥路交叉口西南角向南","type":"高清探头","range":300,"lng":116.474894,"lat":39.956813,"minLng":116.47137858611153,"minLat":39.954118334255035,"maxLng":116.47840941388851,"maxLat":39.95950766574495},
    {id:"218715","location":"京朝麦子店街与亮马桥路交叉口西南角向南200米","type":"高清探头","range":300,"lng":116.475087,"lat":39.955807,"minLng":116.4715716378233,"minLat":39.953112334255046,"maxLng":116.47860236217673,"maxLat":39.95850166574495},
    {id:"218716","location":"京朝四季酒店东南角","type":"高清探头","range":300,"lng":116.474047,"lat":39.955747,"minLng":116.47053164090744,"minLat":39.95305233425504,"maxLng":116.47756235909263,"maxLat":39.95844166574496},
    {id:"218717","location":"京朝四季酒店西南角向南100米","type":"高清探头","range":300,"lng":116.473499,"lat":39.95501,"minLng":116.4699836787899,"minLat":39.952315334255054,"maxLng":116.4770143212101,"maxLat":39.95770466574496},
    {id:"218718","location":"京朝四季酒店西南角向南","type":"高清探头","range":300,"lng":116.473445,"lat":39.95575,"minLng":116.46992964075321,"minLat":39.953055334255055,"maxLng":116.47696035924677,"maxLat":39.958444665744956},
    {id:"218719","location":"京朝四季酒店西南角向东","type":"高清探头","range":300,"lng":116.47362,"lat":39.955759,"minLng":116.47010464029057,"minLat":39.953064334255046,"maxLng":116.47713535970941,"maxLat":39.95845366574496},
    {id:"218720","location":"京朝四季酒店西南角向北100米","type":"高清探头","range":300,"lng":116.473373,"lat":39.956725,"minLng":116.46985759063512,"minLat":39.954030334255044,"maxLng":116.47688840936486,"maxLat":39.95941966574496},
    {id:"218721","location":"京朝希尔顿饭店西北口","type":"高清探头","range":300,"lng":116.468054,"lat":39.959047,"minLng":116.46453847126708,"minLat":39.95635233425505,"maxLng":116.47156952873291,"maxLat":39.96174166574496},
    {id:"218722","location":"京朝希尔顿饭店北侧锅炉房向西","type":"高清探头","range":300,"lng":116.468341,"lat":39.959503,"minLng":116.46482544782363,"minLat":39.956808334255044,"maxLng":116.47185655217629,"maxLat":39.96219766574495},
    {id:"218723","location":"京朝希尔顿饭店北侧锅炉房向东","type":"高清探头","range":300,"lng":116.469329,"lat":39.959613,"minLng":116.46581344216838,"minLat":39.95691833425505,"maxLng":116.4728445578316,"maxLat":39.96230766574495},
    {id:"218724","location":"京朝希尔顿饭店东北角向东","type":"高清探头","range":300,"lng":116.46985,"lat":39.959309,"minLng":116.46633445779747,"minLat":39.95661433425504,"maxLng":116.47336554220252,"maxLat":39.96200366574496},
    {id:"218725","location":"京朝希尔顿饭店东南角","type":"高清探头","range":300,"lng":116.469346,"lat":39.958443,"minLng":116.46583050231847,"minLat":39.95574833425504,"maxLng":116.47286149768152,"maxLat":39.96113766574496},
    {id:"218726","location":"京朝希尔顿饭店东北角向南 ","type":"高清探头","range":300,"lng":116.469813,"lat":39.959162,"minLng":116.46629746535487,"minLat":39.95646733425505,"maxLng":116.47332853464509,"maxLat":39.96185666574496},
    {id:"218727","location":"京朝希尔顿饭店东北角向东100米 ","type":"高清探头","range":300,"lng":116.470856,"lat":39.959413,"minLng":116.46734045245074,"minLat":39.95671833425505,"maxLng":116.47437154754927,"maxLat":39.96210766574496},
    {id:"218728","location":"京朝东方南路与东方东路交叉口西北角","type":"高清探头","range":300,"lng":116.471178,"lat":39.958662,"minLng":116.46766249105993,"minLat":39.95596733425504,"maxLng":116.47469350894008,"maxLat":39.96135666574495},
    {id:"218729","location":"京朝希尔顿饭店西南角路口","type":"高清探头","range":300,"lng":116.468367,"lat":39.958214,"minLng":116.46485151409107,"minLat":39.95551933425505,"maxLng":116.47188248590895,"maxLat":39.96090866574495},
    {id:"205700","location":"京朝白家庄路东口北侧向南","type":"高清探头","range":300,"lng":116.467972,"lat":39.934306,"minLng":116.46445774242439,"minLat":39.931611334255045,"maxLng":116.47148625757562,"maxLat":39.93700066574496},
    {id:"205701","location":"京朝康莱德酒店北侧锦州银行门口三环辅路向南","type":"高清探头","range":300,"lng":116.467927,"lat":39.933093,"minLng":116.46441280470611,"minLat":39.93039833425504,"maxLng":116.4714411952939,"maxLat":39.93578766574496},
    {id:"205702","location":"京朝康莱德酒店北侧锦州银行门口三环辅路向北","type":"高清探头","range":300,"lng":116.467922,"lat":39.933193,"minLng":116.46440779957179,"minLat":39.93049833425505,"maxLng":116.47143620042824,"maxLat":39.93588766574496},
    {id:"205703","location":"京朝康莱德酒店入口北侧向南","type":"高清探头","range":300,"lng":116.467217,"lat":39.932574,"minLng":116.46370283135315,"minLat":39.92987933425505,"maxLng":116.47073116864685,"maxLat":39.93526866574496},
    {id:"205704","location":"京朝康莱德酒店入口北侧向北","type":"高清探头","range":300,"lng":116.467172,"lat":39.932626,"minLng":116.46365782868335,"minLat":39.92993133425504,"maxLng":116.47068617131663,"maxLat":39.93532066574495},
    {id:"205705","location":"京朝康莱德酒店入口北侧向西","type":"高清探头","range":300,"lng":116.46702,"lat":39.932557,"minLng":116.46350583222595,"minLat":39.92986233425505,"maxLng":116.47053416777406,"maxLat":39.93525166574496},
    {id:"205706","location":"京朝康莱德酒店入口北侧向东","type":"高清探头","range":300,"lng":116.46702,"lat":39.932557,"minLng":116.46350583222595,"minLat":39.92986233425505,"maxLng":116.47053416777406,"maxLat":39.93525166574496},
    {id:"205707","location":"京朝嘉铭中心北侧入口向东 ","type":"高清探头","range":300,"lng":116.466967,"lat":39.934092,"minLng":116.46345275341254,"minLat":39.93139733425506,"maxLng":116.47048124658741,"maxLat":39.93678666574496},
    {id:"205708","location":"京朝嘉铭中心北侧入口向西 ","type":"高清探头","range":300,"lng":116.466733,"lat":39.934068,"minLng":116.4632187546449,"minLat":39.93137333425505,"maxLng":116.47024724535513,"maxLat":39.93676266574496},
    {id:"205709","location":"京朝白家庄路东口向北","type":"高清探头","range":300,"lng":116.467955,"lat":39.934376,"minLng":116.46444073883016,"minLat":39.93168133425505,"maxLng":116.47146926116986,"maxLat":39.93707066574497},
    {id:"1","location":"天泽路南口路东","type":"人脸抓拍摄像机-一体化卡口抓拍单元","range":300,"lng":116.474978,"lat":39.957139,"minLng":116.47146256935345,"minLat":39.95444433425504,"maxLng":116.47849343064655,"maxLat":39.95983366574496},
    {id:"2","location":"天泽路南口路西","type":"人脸抓拍摄像机-一体化卡口抓拍单元","range":300,"lng":116.474866,"lat":39.957104,"minLng":116.47135057115264,"minLat":39.954409334255054,"maxLng":116.47838142884733,"maxLat":39.95979866574497},
    {id:"3","location":"天泽路与安家楼路路口东北角","type":"人脸抓拍摄像机","range":300,"lng":116.474856,"lat":39.959594,"minLng":116.4713404431452,"minLat":39.956899334255056,"maxLng":116.4783715568548,"maxLat":39.962288665744964},
    {id:"4","location":"天泽路与安家楼路路口西北角","type":"人脸抓拍摄像机","range":300,"lng":116.474753,"lat":39.95957,"minLng":116.47123744437907,"minLat":39.956875334255045,"maxLng":116.47826855562087,"maxLat":39.96226466574496},
    {id:"5","location":"天泽路与女人街路口东北角","type":"人脸抓拍摄像机-一体化卡口抓拍单元   ","range":300,"lng":116.474656,"lat":39.962244,"minLng":116.47114030689484,"minLat":39.959549334255044,"maxLng":116.47817169310515,"maxLat":39.96493866574496},
    {id:"6","location":"天泽路与女人街路口西北角","type":"人脸抓拍摄像机","range":300,"lng":116.474557,"lat":39.962241,"minLng":116.47104130704912,"minLat":39.95954633425505,"maxLng":116.4780726929509,"maxLat":39.96493566574496},
    {id:"7","location":"东方东路南口东侧","type":"人脸抓拍摄像机","range":300,"lng":116.471147,"lat":39.955879,"minLng":116.46763163412236,"minLat":39.95318433425505,"maxLng":116.47466236587768,"maxLat":39.958573665744964},
    {id:"8","location":"东方东路南口西侧","type":"人脸抓拍摄像机","range":300,"lng":116.471116,"lat":39.955865,"minLng":116.46760063484199,"minLat":39.95317033425505,"maxLng":116.47463136515806,"maxLat":39.958559665744964},
    {id:"9","location":"亮马桥地铁B口东侧","type":"人脸抓拍摄像机","range":300,"lng":116.469934,"lat":39.955744,"minLng":116.46641864106162,"minLat":39.95304933425505,"maxLng":116.47344935893838,"maxLat":39.95843866574497},
    {id:"10","location":"东方东路与亮马桥北街路口东南角","type":"人脸抓拍摄像机","range":300,"lng":116.471139,"lat":39.957778,"minLng":116.46762353650485,"minLat":39.95508333425504,"maxLng":116.47465446349517,"maxLat":39.96047266574496},
    {id:"11","location":"东方东路与亮马桥北街路口东北角","type":"人脸抓拍摄像机","range":300,"lng":116.471152,"lat":39.957844,"minLng":116.46763653311196,"minLat":39.95514933425505,"maxLng":116.47466746688806,"maxLat":39.96053866574496},
    {id:"12","location":"东方东路御东商务楼路边（路东）","type":"人脸抓拍摄像机-一体化卡口抓拍单元","range":300,"lng":116.470838,"lat":39.961042,"minLng":116.46732236869822,"minLat":39.95834733425505,"maxLng":116.47435363130181,"maxLat":39.96373666574495},
    {id:"13","location":"东方东路US联邦公寓路边（路西）","type":"人脸抓拍摄像机 ","range":300,"lng":116.470811,"lat":39.961011,"minLng":116.46729537029208,"minLat":39.95831633425504,"maxLng":116.47432662970793,"maxLat":39.96370566574496},
    {id:"17","location":"安家楼路西口（路北）","type":"一体化卡口抓拍单元","range":300,"lng":116.482907,"lat":39.959628,"minLng":116.47939144139721,"minLat":39.956933334255034,"maxLng":116.48642255860278,"maxLat":39.962322665744956},
    {id:"18","location":"东方东路南口路东","type":"一体化卡口抓拍单元","range":300,"lng":116.471159,"lat":39.955884,"minLng":116.46764363386531,"minLat":39.953189334255036,"maxLng":116.4746743661347,"maxLat":39.95857866574495},
    {id:"19","location":"东方东路南口路西","type":"一体化卡口抓拍单元","range":300,"lng":116.471114,"lat":39.955867,"minLng":116.46759863473918,"minLat":39.953172334255036,"maxLng":116.47462936526084,"maxLat":39.95856166574495},
    {id:"21","location":"东方南路东口（路南）","type":"一体化卡口抓拍单元","range":300,"lng":116.471132,"lat":39.958604,"minLng":116.46761649404169,"minLat":39.955909334255054,"maxLng":116.47464750595837,"maxLat":39.96129866574497},
    {id:"22","location":"朝阳公园路与亮马桥路口西南角","type":"30倍星光球","range":300,"lng":116.477967,"lat":39.957962,"minLng":116.47445152704584,"minLat":39.95526733425504,"maxLng":116.48148247295417,"maxLat":39.960656665744956},
    {id:"23","location":"亮马桥路德国使馆学校门口","type":"30倍星光球","range":300,"lng":116.473518,"lat":39.956824,"minLng":116.47000258554606,"minLat":39.95412933425504,"maxLng":116.47703341445394,"maxLat":39.95951866574495},
    {id:"24","location":"天泽路美国使馆东门对面","type":"30倍星光球","range":300,"lng":116.474811,"lat":39.960217,"minLng":116.47129541111512,"minLat":39.957522334255046,"maxLng":116.47832658888487,"maxLat":39.962911665744954},
    {id:"25","location":"东方东路与安家楼路口东北角","type":"30倍星光球","range":300,"lng":116.471168,"lat":39.959552,"minLng":116.46765244530454,"minLat":39.95685733425505,"maxLng":116.4746835546955,"maxLat":39.96224666574496},
    {id:"26","location":"天泽路南口","type":"30倍星光球","range":300,"lng":116.474897,"lat":39.95712,"minLng":116.47138157033017,"minLat":39.95442533425505,"maxLng":116.47841242966985,"maxLat":39.95981466574496},
    {id:"27","location":"法国使馆西门北侧","type":"30倍星光球","range":300,"lng":116.474909,"lat":39.958384,"minLng":116.47139350535163,"minLat":39.95568933425505,"maxLng":116.47842449464837,"maxLat":39.961078665744964},
    {id:"28","location":"天泽路与安家楼路口西南角","type":"30倍星光球","range":300,"lng":116.474777,"lat":39.959562,"minLng":116.4712614447904,"minLat":39.95686733425505,"maxLng":116.47829255520963,"maxLat":39.96225666574496},
    {id:"29","location":"天泽路润世中心二期西侧","type":"30倍星光球","range":300,"lng":116.474809,"lat":39.960335,"minLng":116.4712934050483,"minLat":39.95764033425505,"maxLng":116.47832459495167,"maxLat":39.963029665744955},
    {id:"31","location":"天泽路女人街对面","type":"30倍星光球","range":300,"lng":116.474674,"lat":39.96222,"minLng":116.47115830812886,"minLat":39.95952533425505,"maxLng":116.47818969187112,"maxLat":39.96491466574496},
    {id:"32","location":"天泽路莱太花卉门口","type":"30倍星光球","range":300,"lng":116.467934,"lat":39.957657,"minLng":116.46441854272507,"minLat":39.95496233425505,"maxLng":116.47144945727494,"maxLat":39.96035166574496},
    {id:"33","location":"东方东路南口路西","type":"30倍星光球","range":300,"lng":116.471114,"lat":39.955871,"minLng":116.46759863453353,"minLat":39.95317633425505,"maxLng":116.47462936546648,"maxLat":39.95856566574497},
    {id:"34","location":"东方东路与安家楼路口西侧","type":"30倍星光球","range":300,"lng":116.471141,"lat":39.959468,"minLng":116.46762544962309,"minLat":39.956773334255054,"maxLng":116.47465655037695,"maxLat":39.96216266574497},
    {id:"35","location":"东方东路东方国际大厦门口","type":"30倍星光球","range":300,"lng":116.471168,"lat":39.959027,"minLng":116.46765247229528,"minLat":39.956332334255045,"maxLng":116.47468352770476,"maxLat":39.96172166574496},
    {id:"36","location":"东方东路韩国使馆西门北侧","type":"30倍星光球","range":300,"lng":116.471199,"lat":39.959093,"minLng":116.46768346890217,"minLat":39.95639833425504,"maxLng":116.47471453109777,"maxLat":39.96178766574495},
    {id:"37","location":"东方东路美国使馆西门北侧","type":"30倍星光球","range":300,"lng":116.471129,"lat":39.960197,"minLng":116.46761341214344,"minLat":39.95750233425505,"maxLng":116.4746445878566,"maxLat":39.962891665744955},
    {id:"38","location":"东方东路御东写字楼西北角","type":"30倍星光球","range":300,"lng":116.470521,"lat":39.961421,"minLng":116.46700534921155,"minLat":39.95872633425505,"maxLng":116.47403665078852,"maxLat":39.964115665744956},
    {id:"39","location":"东方东路安家楼路口","type":"30倍星光球","range":300,"lng":116.471163,"lat":39.959534,"minLng":116.4676474462299,"minLat":39.956839334255044,"maxLng":116.47467855377009,"maxLat":39.96222866574496},
    {id:"40","location":"US联邦公寓高点","type":"40倍中载激光云台","range":1500,"lng":116.470205,"lat":39.960779,"minLng":116.4526269113204,"minLat":39.94730567127522,"maxLng":116.4877830886796,"maxLat":39.97425232872479},
    {id:"41","location":"如家酒店高点","type":"40倍中载激光云台","range":1500,"lng":116.475722,"lat":39.949845,"minLng":116.45814672140163,"minLat":39.93637167127523,"maxLng":116.49329727859839,"maxLat":39.963318328724796},
    {id:"42","location":"润世中心二期高点 ","type":"40倍中载激光云台","range":1500,"lng":116.476022,"lat":39960477,"minLng":116.4463444455642,"minLat":62.98652667383868,"maxLng":116.50569955443586,"maxLat":63.01347333128822},
    {id:"43","location":"21世纪高点（暂定）","type":"40倍中载激光云台","range":1500,"lng":116.462926,"lat":39.906364,"minLng":116.44536188097918,"minLat":39.892890671275225,"maxLng":116.48049011902081,"maxLat":39.91983732872478}
    ];
// 离线版警徽弹出窗口配置
var opts = {
    // 信息窗口宽度
    width: 250,
    // 信息窗口高度 
    height: 120,
    enableAutoPan: false,
    //设置允许信息窗发送短息
    enableMessage: true
};


/**
 * 设置百度地图配置
 */
function setBmapOption() {
    
    lmap = myChart.getModel().getComponent('leaflet').getLeaflet();
    //lmap.zoomControl.setPosition('bottomright');//设置缩放按钮于右下角
    //lmap.dragging.disable();
    myChart.on('brush', function(){
        lmap.dragging.disable();  
    });
    
    
    //lmap.dragging.disable();
    //lmap = L.map('container').setView([39.918461, 116.461985], 12);
    //console.log(lmap);
    
    lmap.zoomControl.setPosition('bottomright');//设置缩放按钮于右下角
    //$(".leaflet-control-zoom").css("visibility", "hidden");//设置不显示缩放按钮
    // 使用用户自己的图标
    var greenIcon = L.icon({
        iconUrl: './img/marker_red_sprite.png',
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [16, 16], // size of the icon
       //shadowSize:   [50, 64], // size of the shadow
       // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
       // shadowAnchor: [4, 62],  // the same for the shadow
       // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    // 创建公安局派出所标记信息和弹出侧边栏事件
    for (var i = 0; i < localSearchData.length; i++) {
        var marker = L.marker([localSearchData[i][1],localSearchData[i][0]],{icon: greenIcon});
        if (localSearchData[i].length === 6) {
            var content = '<h5 style="color: #CC5522;font-size: 14px;font-weight: bold;">' + localSearchData[i][2] + '</h5><h6>' + localSearchData[i][3] + '</h6><h6>' + localSearchData[i][4] + '</h6><h6>' + localSearchData[i][5] + '</h6>';
        } else {
            content = '<h5 style="color: #CC5522;font-size: 14px;font-weight: bold;">' + localSearchData[i][2] + '</h5><h6>' + localSearchData[i][3] + '</h6><h6>' + localSearchData[i][4] + '</h6>';
        }
        // 将标记添加到地图中
        marker.addTo(lmap).bindPopup(content);
        //.openPopup();
    }

    function addClickHandler(content, marker) {
        marker.addEventListener("click", function(e) {
            openInfo(content, e)
        });
    }

    function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        // 创建信息窗口对象 
        var infoWindow = new BMap.InfoWindow(content, opts);
        //开启信息窗口 
        bmap.openInfoWindow(infoWindow, point);
    }

}

// 设置百度地图配置
setBmapOption();


// 改变地图中心点位置(导航栏右上角功能)
$('#police-station-menu ul ul li').click(function() {
    var choice = $(this).text();
    switch (choice) {
        case '麦子店派出所':
            $('#choice').text('麦子店派出所');
            var point = new BMap.Point(116.47974, 39.953064);
            bmap.centerAndZoom(point, 16);
            var $b = $('#choice');
            $('<b>').addClass('caret').appendTo($b);
            var content = '<h5 style="color: #CC5522;font-size: 14px;font-weight: bold;">' + localSearchData[localSearchData.length - 1][2] + '</h5><h6>' + localSearchData[localSearchData.length - 1][3] + '</h6><h6>' + localSearchData[localSearchData.length - 1][4] + '</h6><h6>' + localSearchData[localSearchData.length - 1][5] + '</h6>';
            var infoWindow = new BMap.InfoWindow(content, opts);
            bmap.openInfoWindow(infoWindow, point); //打开信息窗口
            break;
        case '三里屯派出所':
            $('#choice').text('三里屯派出所');
            var point1 = new BMap.Point(116.460125, 39.941686);
            bmap.centerAndZoom(point1, 16);
            var $b = $('#choice');
            $('<b>').addClass('caret').appendTo($b);
            var content = '<h5 style="color: #CC5522;font-size: 14px;font-weight: bold;">' + localSearchData[localSearchData.length - 2][2] + '</h5><h6>' + localSearchData[localSearchData.length - 2][3] + '</h6><h6>' + localSearchData[localSearchData.length - 2][4] + '</h6><h6>' + localSearchData[localSearchData.length - 2][5] + '</h6>';
            var infoWindow = new BMap.InfoWindow(content, opts);
            bmap.openInfoWindow(infoWindow, point1); //打开信息窗口
            break;
        default:
            $('#choice').text('默认');
            bmap.centerAndZoom(new BMap.Point(116.46, 39.92), 14);
            var $b = $('#choice');
            $('<b>').addClass('caret').appendTo($b);
            bmap.closeInfoWindow(infoWindow, point1);
            break;
    }
});


/*******************************************************
 * Mapv相关配置
 * 1、外来人口图用Mapv的grid形式显示
 *******************************************************/

/**
 * 返回外来人口网格图配置
 * @return {Object} [外来人口网格图的配置对象]
 */
function getOutsiderMapvOption() {
    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        size: 40,
        globalAlpha: 0.3,
        label: {
            show: true,
            fillStyle: '#fff'
        },
        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
		max: 15000,
        draw: 'grid'
    }
    return options;
}


/**
 * 返回犯罪预测网格图配置
 * @return {Object} [犯罪预测网格图配置]
 */
function getCrimePredictMapvOption() {
    var options = {
        fillStyle: 'rgba(55, 50, 250, 0.8)',
        shadowColor: 'rgba(255, 250, 50, 1)',
        shadowBlur: 20,
        size: 40,
        globalAlpha: 0.3,
        label: {
            show: true,
            fillStyle: '#fff'
        },
        gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
        draw: 'grid'
    }
    return options;
}

/**
 * 返回犯罪预测网格图配置
 * @return {Object} [犯罪预测网格图配置]
 */
function getCameraMapvOption() {
    var options = {
        fillStyle: 'rgba(255, 50, 50, 0.6)',
		//maxSize: 20,
		//max: 30,
		draw: 'bubble'
    }
    return options;
}