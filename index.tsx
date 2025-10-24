// --- START OF INLINED SCRIPT ---
// FIX: Cast window to `any` to polyfill process.env without TypeScript errors.
(window as any).process = (window as any).process || { env: {} }; // Polyfill for process.env
(window as any).process.env.API_KEY = 'AIzaSyBL42fp-nL0cAZYDc5etd0Ga5b4I3CoG7I';

// --- External Imports ---
import React, { useState, useRef, useCallback, useEffect } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
import { GoogleGenAI, Type, Modality } from 'https://esm.sh/@google/genai';

// --- Inlined from types.ts ---
// Note: TypeScript types are stripped by Babel during transpilation.
interface Passage {
  id: number;
  volume: 1 | 2;
  title: string;
  content: string;
}

interface EvaluationResult {
  docDayDu: boolean; // Thêm trường này để kiểm tra độ hoàn chỉnh
  tongDiem: number;
  doLuuLoat: number;
  phatAm: number;
  doChinhXac: number;
  nhanXetChung: string;
  tuPhatAmSai: {
    tu: string;
    phatAmSai: string;
    suaLai: string;
  }[];
  diemTichCuc: string[];
}

interface StudentInfo {
  name: string;
  studentClass: string;
}

type Page = 'welcome' | 'passage-list' | 'reading' | 'evaluation';

type SheetSaveStatus = 'idle' | 'saving' | 'success' | 'error';

// --- Inlined from constants.ts ---
// FIX: Explicitly type `READING_PASSAGES` as `Passage[]` to ensure correct type inference for its elements.
const READING_PASSAGES: Passage[] = [
    // TẬP 1
    { id: 1, volume: 1, title: 'Bài 1: Tôi là học sinh lớp 2', content: 'Ngày khai trường đã đến. Sáng sớm, mẹ mới gọi một câu mà tôi đã vùng dậy, khác hẳn mọi ngày. Loáng một cái, tôi đã chuẩn bị xong mọi thứ. Bố ngạc nhiên nhìn tôi, còn mẹ cười tủm tỉm. Tôi rối rít: “Con muốn đến sớm nhất lớp”.\nTôi háo hức tưởng tượng ra cảnh mình đến đầu tiên, cất tiếng chào thật to những bạn đến sau. Nhưng vừa đến cổng trường, tôi đã thấy mấy bạn cùng lớp đang ríu rít nói cười ở trong sân. Thì ra, không chỉ mình tôi muốn đến sớm nhất. Tôi chào mẹ, chạy ào vào cùng các bạn.' },
    { id: 2, volume: 1, title: 'Bài 2: Ngày hôm qua đâu rồi?', content: 'Em cầm tờ lịch cũ:\n– Ngày hôm qua đâu rồi?\nRa ngoài sân hỏi bố\nXoa đầu em, bố cười:\n\n– Ngày hôm qua ở lại\nTrên cành hoa trong vườn\nNụ hồng lớn lên mãi\nĐợi đến ngày toả hương.\n\n– Ngày hôm qua ở lại\nTrong hạt lúa mẹ trồng\nCánh đồng chờ gặt hái\nChín vàng màu ước mong.\n\n– Ngày hôm qua ở lại\nTrong vở hồng của con\nCon học hành chăm chỉ\nLà ngày qua vẫn còn.' },
    { id: 3, volume: 1, title: 'Bài 3: Niềm vui của Bi và Bống', content: 'Khi cơn mưa vừa dứt, hai anh em Bi và Bống chợt thấy cầu vồng. Cầu vồng kia! Em nhìn xem. Đẹp quá!\nBi chỉ lên bầu trời và nói tiếp:\n– Anh nghe nói dưới chân cầu vồng có bảy hũ vàng đấy.\nBống hưởng ứng:\n– Lát nữa, mình sẽ đi lấy về nhé! Có vàng rồi, em sẽ mua nhiều búp bê và quần áo đẹp.\n– Còn anh sẽ mua một con ngựa hồng và một cái ô tô.\nBỗng nhiên, cầu vồng biến mất. Bi cười:\n– Em ơi! Anh đùa đấy! Ở đó không có vàng đâu.' },
    { id: 4, volume: 1, title: 'Bài 4: Làm việc thật là vui', content: 'Quanh ta, mọi vật, mọi người đều làm việc.\nCái đồng hồ tích tắc, tích tắc, báo phút, báo giờ. Con gà trống gáy vang ò ó o, báo cho mọi người biết trời sắp sáng, mau mau thức dậy. Con tu hú kêu tu hú, tu hú. Thế là sắp đến mùa vải chín. Chim bắt sâu, bảo vệ mùa màng. Cành đào nở hoa cho sắc xuân thêm rực rỡ, ngày xuân thêm tưng bừng. Chim cú mèo chập tối đúng trong hốc cây rúc cú cú cũng làm việc có ích cho đồng ruộng.\nNhư mọi vật, mọi người, bé cũng làm việc. Bé làm bài. Bé đi học. Học xong, bé quét nhà, nhặt rau, chơi với em đỡ mẹ. Bé luôn luôn bận rộn, mà lúc nào cũng vui.' },
    { id: 5, volume: 1, title: 'Bài 5: Em có xinh không?', content: 'Voi em thích mặc đẹp và thích được khen xinh. Ở nhà, voi em luôn hỏi anh: “Em có xinh không?”. Voi anh bao giờ cũng khen: “Em xinh lắm!”.\nMột hôm, gặp hươu, voi em hỏi:\n– Em có xinh không?\nHươu ngắm voi rồi lắc đầu:\n– Chưa xinh lắm vì em không có đôi sừng giống anh.\nNghe vậy, voi nhặt vài cành cây khô, gài lên đầu rồi đi tiếp.\nGặp dê, voi hỏi:\n– Em có xinh không?\n– Không, vì cậu không có bộ râu giống tôi.\nVoi liền nhổ một khóm cỏ dại bên đường, gắn vào cằm rồi về nhà.\nVề nhà với đôi sừng và bộ râu giả, voi em hớn hở hỏi anh:\n– Em có xinh hơn không?\nVoi anh nói:\n– Trời ơi, sao em lại thêm sừng và râu thế này? Xấu lắm!\nVoi em ngắm mình trong gương và thấy xấu thật. Sau khi bỏ sừng và râu đi, voi em thấy mình xinh đẹp hẳn lên. Giờ đây, voi em hiểu rằng mình chỉ xinh đẹp khi đúng là voi.' },
    { id: 6, volume: 1, title: 'Bài 6: Một giờ học', content: 'Thầy giáo nói: “Chúng ta cần học cách giao tiếp tự tin. Vì thế hôm nay chúng ta sẽ tập nói trước lớp về bất cứ điều gì mình thích.”.\nQuang được mời lên nói đầu tiên. Cậu lúng túng, đỏ mặt. Quang cảm thấy nói với bạn bên cạnh thì dễ, nhưng nói trước cả lớp thì sao mà khó thế. Thầy bảo: “Sáng nay ngủ dậy, em đã làm gì? Em có nhớ xem.”.\nQuang ngập ngừng, vừa nói vừa gãi đầu: “Em…”.\nThầy giáo nhắc: “Rồi gì nữa?”.\nQuang lại gãi đầu: “À… ờ… Em ngủ dậy.”. Và cậu nói tiếp: “Rồi… ờ…”. Thầy giáo mỉm cười, kiên nhẫn nghe Quang nói. Thầy bảo: “Thế là được rồi đấy!”.\nNhưng Quang chưa chịu về chỗ. Bỗng cậu nói to: “Rồi sau đó… ờ… à…”. Quang thở mạnh một hơi rồi nói tiếp: “Mẹ… ờ… bảo: Con đánh răng đi. Thế là em đánh răng.”. Thầy giáo vỗ tay. Cả lớp vỗ tay theo. Cuối cùng, Quang nói với giọng rất tự tin: “Sau đó bố đưa em đi học.”.\nThầy giáo vỗ tay. Các bạn vỗ tay theo. Quang cũng vỗ tay. Cả lớp tràn ngập tiếng vỗ tay.' },
    { id: 7, volume: 1, title: 'Bài 7: Cây xấu hổ', content: 'Bỗng dưng, gió ào ào nổi lên. Có tiếng động gì lạ lắm. Những chiếc lá khô lạt xạt lướt trên cỏ. Cây xấu hổ co rúm mình lại.\nNó bỗng thấy xung quanh xôn xao. Nó hé mắt nhìn: không có gì lạ cả. Bấy giờ, nó mới mở bừng những con mắt lá. Quả nhiên, không có gì lạ thật.\nNhưng những cây cỏ xung quanh vẫn cứ xôn xao. Thì ra, vừa có một con chim xanh biếc, toàn thân lóng lánh như tự toả sáng không biết từ đâu bay tới. Chim đậu một thoáng trên cành thanh mai rồi lại vội bay đi.\nCác cây cỏ xuýt xoa: biết bao nhiêu con chim đã bay qua đây, chưa có con nào đẹp đến thế.\nCàng nghe bạn bè trầm trồ, cây xấu hổ càng tiếc. Không biết bao giờ con chim xanh ấy quay trở lại?' },
    { id: 8, volume: 1, title: 'Bài 8: Cầu thủ dự bị', content: 'Nhìn các bạn đá bóng, gấu con rất muốn chơi cùng. Nhưng thấy gấu con có vẻ chậm chạp và đá bóng không tốt nên chưa đội nào muốn nhận cậu.\n– Gấu à, cậu làm cầu thủ dự bị nhé! – Khi nói.\nGấu con hơi buồn nhưng cũng đồng ý. Trong khi chờ được vào sân, gấu đi nhặt bóng cho các bạn. Gấu cố gắng chạy thật nhanh để các bạn không phải chờ lâu.\nHằng ngày, gấu đến sân bóng từ sớm để luyện tập. Gấu đá bóng ra xa, chạy đi nhặt rồi đá vào gôn, đá đi đá lại,… Cứ thế, gấu đá bóng ngày càng giỏi hơn.\nMột hôm, đến sân bóng thấy gấu đang luyện tập, các bạn ngạc nhiên nhìn gấu rồi nói: “Cậu giỏi quá!”, “Này, vào đội tớ nhé!”, “Vào đội tớ đi!”.\n– Tớ nên vào đội nào đây? – Gấu hỏi khỉ.\n– Hiệp đầu cậu đá cho đội đỏ, hiệp sau cậu đá cho đội xanh. – Khỉ nói.\nGấu vui vẻ gật đầu. Cậu nghĩ: “Hoá ra làm cầu thủ dự bị cũng hay nhỉ!”.' },
    { id: 9, volume: 1, title: 'Bài 9: Cô giáo lớp em', content: 'Sáng nào em đến lớp\nCũng thấy cô đến rồi.\nĐáp lời “Chào cô ạ!”\nCô mỉm cười thật tươi.\n\nCô dạy em tập viết\nGió đưa thoảng hương nhài\nNắng ghé vào cửa lớp\nXem chúng em học bài.\n\nNhững lời cô giáo giảng\nẤm trang vở thơm tho\nYêu thương em ngắm mãi\nNhững điểm mười cô cho.' },
    { id: 10, volume: 1, title: 'Bài 10: Thời khoá biểu', content: 'Thời khoá biểu cho biết thời gian học các môn của từng ngày trong tuần. Thời khoá biểu gồm nhiều cột dọc và nhiều hàng ngang. Các bạn học sinh thường đọc thời khoá biểu theo trình tự thứ – buổi – tiết – môn.' },
    { id: 11, volume: 1, title: 'Bài 11: Cái trống trường em', content: 'Cái trống trường em\nMùa hè cũng nghỉ\nSuốt ba tháng liền\nTrống nằm ngẫm nghĩ.\n\nBuồn không hả trống\nTrong những ngày hè\nBọn mình đi vắng\nChỉ còn tiếng ve?\n\nCái trống lặng im\nNghiêng đầu trên giá\nChắc thấy chúng em\nNó mừng vui quá!\n\nKia trống đang gọi:\nTùng! Tùng! Tùng! Tùng!\nVào năm học mới\nGiọng vang tưng bừng.' },
    { id: 12, volume: 1, title: 'Bài 12: Danh sách học sinh', content: 'Hôm nay, chúng tôi được đọc truyện tại lớp. Cô giáo cho chúng tôi đăng kí đọc truyện theo sở thích. Dưới đây là danh sách đăng kí của tổ tôi.\nDựa vào danh sách đăng kí, cô chia lớp thành ba nhóm, mỗi nhóm đọc một truyện. Chúng tôi đọc cho nhau nghe, rồi cùng nhau trao đổi về các nhân vật trong truyện mà nhóm đã chọn.' },
    { id: 13, volume: 1, title: 'Bài 13: Yêu lắm trường ơi!', content: 'Em yêu mái trường\nCó hàng cây mát\nXôn xao khúc nhạc\nTiếng chim xanh trời.\n\nMỗi giờ ra chơi\nSân trường nhộn nhịp\nHồng hào gương mặt\nBạn nào cũng xinh.\n\nYêu lớp học em\nCó khung cửa sổ\nCó bàn tay lá\nQuạt gió mát vào.\n\nLời cô ngọt ngào\nThấm từng trang sách\nNgày không đến lớp\nThấy nhớ nhớ ghê!\n\nCô đếm trong mơ\nBỗng cười khúc khích\nNgỡ đang ở lớp\nCùng bạn đùa vui.' },
    { id: 14, volume: 1, title: 'Bài 14: Em học vẽ', content: 'Hôm nay trong lớp học\nVới giấy trắng, bút màu\nNắn nót em ngồi vẽ\nLung linh bầu trời sao.\n\nVẽ ông trăng trên cao\nRải ánh vàng đầy ngõ\nVẽ cánh diều no gió\nVi vu giữa trời xanh.\n\nVẽ biển cả trong lành\nCó một con thuyền trắng\nGiương cánh buồm đỏ thắm\nĐang rẽ sóng ra khơi.\n\nVẽ cả ông mặt trời\nVà những chùm phượng đỏ\nTrên sân trường lộng gió\nGọi ve về râm ran.' },
    { id: 15, volume: 1, title: 'Bài 15: Cuốn sách của em', content: 'Mỗi cuốn sách ra đời đều được gọi là nhà xuất bản. Tên nhà xuất bản thường được ghi ở phía dưới bìa sách.\nPhần lớn các cuốn sách đều có mục lục thể hiện các mục chính và vị trí của chúng trong cuốn sách. Mục lục thường được đặt ở ngay sau trang bìa, cũng có khi được đặt ở cuối sách.\nMỗi lần đọc một cuốn sách mới, đừng quên những điều này em nhé.' },
    { id: 16, volume: 1, title: 'Bài 16: Khi trang sách mở ra', content: 'Khi trang sách mở ra\nChân trời xa xích lại\nBắt đầu là cỏ dại\nThứ đến là cánh chim\nSau nữa là trẻ con\nCuối cùng là người lớn.\n\nTrong trang sách có biển\nEm thấy những cánh buồm\nTrong trang sách có rừng\nVới bao nhiêu là gió.\n\nTrang sách còn có lửa\nMà giấy chẳng cháy đâu\nTrang sách có ao sâu\nMà giấy không hề ướt.\n\nTrang sách không nói được\nSao em nghe điều gì\nDạt dào như sóng vỗ\nMột chân trời đang đi.' },
    { id: 17, volume: 1, title: 'Bài 17: Gọi bạn', content: 'Tự xa xưa, thuở nào\nTrong rừng xanh sâu thẳm\nĐôi bạn sống bên nhau\nBê vàng và dê trắng.\n\nMột năm, trời hạn hán\nSuối cạn, cỏ héo khô\nLấy gì nuôi đôi bạn\nChờ mưa đến bao giờ?\n\nBê vàng đi tìm cỏ\nLang thang quên đường về\nDê trắng thương bạn quá\nChạy khắp nẻo tìm bê\nĐến bây giờ dê trắng\nVẫn gọi hoài: “Bê! Bê!”.' },
    { id: 18, volume: 1, title: 'Bài 18: Tớ nhớ cậu', content: 'Kiến là bạn thân của Sóc. Hằng ngày, hai bạn thường rủ nhau đi học. Thế rồi nhà Kiến chuyển đến một khu rừng khác. Lúc chia tay, Kiến rất buồn. Kiến nói: “Cậu phải thường xuyên nhớ tớ đấy.”. Sóc gật đầu nhận lời.\nMột buổi sáng, Sóc lấy một tờ giấy và viết thư cho Kiến. Sóc nắn nót ghi: “Tớ nhớ cậu.”. Một cơn gió đi ngang qua mang theo lá thư. Chiều hôm đó, Kiến đi dạo trong rừng. Một lá thư nhè nhẹ bay xuống. Kiến reo lên: “A, thư của Sóc!”.\nHôm sau, Kiến ngồi bên thềm và viết thư cho Sóc. Kiến không biết làm sao cho Sóc biết mình rất nhớ bạn. Cậu viết: “Chào Sóc!”. Nhưng Kiến không định chào Sóc. Cậu bèn viết một lá thư khác: “Sóc thân mến!”. Như thế vẫn không đúng ý của Kiến. Lấy một tờ giấy mới, Kiến ghi: “Sóc ơi!”. Cứ thế, cậu cặm cụi viết đi viết lại trong nhiều giờ liền.\nKhông lâu sau, Sóc nhận được một lá thư do Kiến gửi đến. Thư viết: “Sóc ơi, tớ cũng nhớ cậu!”.' },
    { id: 19, volume: 1, title: 'Bài 19: Chữ A và những người bạn', content: 'Tôi là chữ A. Từ lâu, tôi đã nổi tiếng. Hễ nhắc đến tên tôi, ai cũng biết. Khi vui sướng quá, người ta thường reo lên tên tôi. Khi ngạc nhiên, sững sờ, người ta cũng gọi tên tôi.\nTôi đứng đầu bảng chữ cái tiếng Việt. Trong bảng chữ cái của nhiều nước, tôi cũng được người ta trân trọng xếp ở đầu hàng. Hằng năm, cứ đến ngày khai trường, rất nhiều trẻ em làm quen với tôi trước tiên.\nTôi luôn mơ ước chỉ mình tôi làm ra một cuốn sách. Nhưng rồi, tôi nhận ra rằng, nếu chỉ một mình, tôi chẳng thể nói được với ai điều gì. Một cuốn sách chỉ toàn chữ A không thể là cuốn sách mà mọi người muốn đọc. Để có cuốn sách hay, tôi cần các bạn B, C, D, Đ, E,...\nChúng tôi luôn ở bên nhau và cần có nhau trên những trang sách.\nCác bạn nhỏ hãy gặp chúng tôi hằng ngày nhé!' },
    { id: 20, volume: 1, title: 'Bài 20: Nhím nâu kết bạn', content: 'Trong khu rừng nọ, có chú nhím nâu hiền lành, nhút nhát. Một buổi sáng, chú đang kiếm quả cây thì thấy nhím trắng chạy tới. Nhím trắng vốn vã: “Chào bạn! Rất vui được gặp bạn!”. Nhím nâu lúng túng, nói lí nhí: “Chào bạn!”, rồi nấp vào bụi cây. Chú cuộn tròn người lại mà vẫn sợ hãi.\nMùa đông đến, nhím nâu đi tìm nơi để trú ngụ. Bất chợt, mưa kéo đến. Nhím nâu vội bước vào cái hang nhỏ. Thì ra là nhà nhím trắng. Nhím nâu run run: “Xin lỗi, tôi không biết đây là nhà của bạn.”. Nhím trắng tươi cười: “Đừng ngại! Gặp lại bạn, tôi rất vui. Tôi ở đây một mình, buồn lắm. Bạn ở lại cùng tôi nhé!”.\n“Nhím trắng tốt bụng quá. Bạn ấy nói đúng, không có bạn bè thì thật buồn.”. Nghĩ thế, nhím nâu mạnh dạn hẳn lên. Chú nhận lời kết bạn với nhím trắng. Cả hai cùng thu dọn, trang trí chỗ ở cho đẹp. Chúng trải qua những ngày vui vẻ, ấm áp vì không phải sống một mình giữa mùa đông lạnh giá.' },
    { id: 21, volume: 1, title: 'Bài 21: Thả diều', content: '(Trích)\nCánh diều no gió\nSáo nó thổi vang\nSao trời trôi qua\nDiều thành trăng vàng.\n\nCánh diều no gió\nTiếng nó trong ngần\nDiều hay chiếc thuyền\nTrôi trên sông Ngân.\n\nCánh diều no gió\nTiếng nó nói với\nDiều là hạt cau\nPhơi trên nong trời.\n\nTrời như cánh đồng\nXong mùa gặt hái\nDiều em – lưỡi liềm\nAi quên bỏ lại.\n\nCánh diều no gió\nNhạc trời réo vang\nTiếng diều xanh lúa\nUốn cong tre làng.' },
    { id: 22, volume: 1, title: 'Bài 22: Tớ là Lê-gô', content: 'Tớ là lê-gô. Nhiều bạn gọi tớ là đồ chơi lắp ráp. Các bạn có nhận ra tớ không? Tớ có rất nhiều anh chị em. Chúng tớ là những khối nhỏ đầy màu sắc. Hầu hết chúng tớ có hình viên gạch. Một số thành viên có hình nhân vật tí hon và các hình xinh xắn khác.\nTừ những mảnh ghép nhỏ bé, chúng tớ kết hợp với nhau để tạo ra cả một thế giới diệu kì. Các bạn có thể lắp ráp nhà cửa, xe cộ, người máy,... theo ý thích. Sau đó, các bạn tháo rời ra để ghép thành những vật khác.\nChúng tớ giúp các bạn có trí tưởng tượng phong phú, khả năng sáng tạo và tính kiên nhẫn. Nào, các bạn đã sẵn sàng chơi cùng chúng tớ chưa?' },
    { id: 23, volume: 1, title: 'Bài 23: Rồng rắn lên mây', content: 'Rồng rắn lên mây là một trò chơi vui nhộn. Năm, sáu bạn túm áo nhau làm rồng rắn. Một bạn làm thầy thuốc, đứng đối diện với rồng rắn. Rồng rắn vừa đi vòng vèo vừa hát:\nRồng rắn lên mây\nThấy cây núc nác\nHỏi thăm thầy thuốc\nCó nhà hay không?\nNếu thầy nói “không” thì rồng rắn đi tiếp. Nếu thầy nói “có” thì rồng rắn hỏi xin thuốc cho con và đồng ý cho thầy bắt khúc đuôi.\nThầy thuốc tìm cách bắt khúc đuôi. Bạn làm đầu dang tay cản thầy thuốc, bạn làm đuôi tìm cách tránh thầy. Nếu bạn khúc đuôi để thầy bắt được thì đổi vai làm thầy thuốc. Nếu bạn khúc giữa để đứt thì đổi vai làm đuôi. Trò chơi cứ thế tiếp tục.' },
    { id: 24, volume: 1, title: 'Bài 24: Nặn đồ chơi', content: 'Bên thềm gió mát,\nBé nặn đồ chơi.\nMèo nằm vẫy đuôi,\nTròn xoe đôi mắt.\n\nĐây là quả thị,\nĐây là quả na,\nQuả này phần mẹ,\nQuả này phần cha.\n\nĐây chiếc cối nhỏ\nBé nặn thật tròn,\nBiếu bà đấy nhé,\nGiã trầu thêm ngon.\n\nĐây là thằng chuột\nTặng riêng chú mèo,\nMèo ta thích chí\nVểnh râu “meo meo”!\n\nNgoai hiên đã nắng,\nBé nặn xong rồi.\nĐừng sờ vào đấy,\nBé còn đang phơi.' },
    { id: 25, volume: 1, title: 'Bài 25: Sự tích hoa tỉ muội', content: 'Ngày xưa, có hai chị em Nết và Na mồ côi cha mẹ, sống trong ngôi nhà nhỏ bên sườn núi. Nết thương Na, cái gì cũng nhường em. Đêm đông, gió ù ù lùa vào nhà, Nết vòng tay ôm em:\n– Em rét không?\nNa ôm choàng lấy chị, cười rúc rích:\n– Ấm quá!\nNết ôm em chặt hơn, thầm thì:\n– Mẹ bảo chị em mình là hai bông hoa hồng, chị là bông to, em là bông nhỏ. Chị em mình mãi bên nhau nhé!\nNa gật đầu. Hai chị em cứ thế ôm nhau ngủ.\nNăm ấy, nước lũ dâng cao, Nết cõng em chạy theo dân làng đến nơi an toàn. Hai bàn chân Nết rớm máu. Thấy vậy, Bụt thương lắm. Bụt liền phẩy chiếc quạt thần. Kì lạ thay, bàn chân Nết bỗng lành hẳn. Nơi bàn chân Nết đi qua mọc lên những khóm hoa đỏ thắm. Hoa kết thành chùm, bông hoa lớn che chở cho nụ hoa bé nhỏ. Chúng cũng đẹp như tình chị em của Nết và Na.\nDân làng đặt tên cho loài hoa ấy là hoa tỉ muội.' },
    { id: 26, volume: 1, title: 'Bài 26: Em mang về yêu thương', content: 'Mẹ, mẹ ơi em bé\nTừ đâu đến nhà ta\nNụ cười như tia nắng\nBàn tay như nụ hoa\nBước chân đi lẫm chẫm\nTiếng cười vang sân nhà?\n\nHay bé từ sao xuống\nHay từ biển bước lên\nHay bé trong quả nhãn\nÔng trồng cạnh hàng hiên?\n\nHay bé theo cơn gió\nNằm cuộn tròn trong mây\nRồi biến thành giọt nước\nRơi xuống nhà mình đây?\n\nMỗi sáng em thức giấc\nLà như thể mây, hoa\nCùng nắng vàng biển rộng\nMang yêu thương vào nhà.' },
    { id: 27, volume: 1, title: 'Bài 27: Mẹ', content: 'Lặng rồi cả tiếng con ve\nCon ve cũng mệt vì hè nắng oi.\nNhà em vẫn tiếng ạ ơi\nKẽo cà tiếng võng mẹ ngồi mẹ ru.\n\nLời ru có gió mùa thu\nBàn tay mẹ quạt mẹ đưa gió về.\nNhững ngôi sao thức ngoài kia\nChẳng bằng mẹ đã thức vì chúng con.\n\nĐêm nay con ngủ giấc tròn\nMẹ là ngọn gió của con suốt đời.' },
    { id: 28, volume: 1, title: 'Bài 28: Trò chơi của bố', content: 'Bố luôn dành cho Hương những điều ngạc nhiên. Lúc rảnh rỗi, hai bố con ngồi chơi với nhau như đôi bạn cùng tuổi.\nCó lần, hai bố con chơi trò chơi “ăn cỗ”. Hương đưa cái bát nhựa cho bố:\n– Mời bác xơi!\nBố đỡ bằng hai tay hẳn hoi và nói:\n– Xin bác. Mời bác xơi!\n– Bác xơi nữa không ạ?\n– Cảm ơn bác! Tôi đủ rồi.\nHai bố con cùng phá lên cười. Lát sau, hai bố con đổi cho nhau. Bố hỏi:\n– Bác xơi gì ạ?\n– Dạ, xin bác bát miến ạ.\n– Đây, mời bác.\nHương đưa tay ra cầm lấy cái bát nhựa. Bố bảo:\n– Ấy, bác phải đỡ bằng hai tay. Tôi đưa cho bác bằng hai tay cơ mà!\nNăm nay, bố đi công tác xa. Đến bữa ăn, nhìn hai bàn tay của Hương lễ phép đón bát cơm, mẹ lại nhớ đến lúc hai bố con chơi với nhau. Mẹ nghĩ, Hương không biết rằng ngay trong trò chơi ấy, bố đã dạy con một nết ngoan.' },
    { id: 29, volume: 1, title: 'Bài 29: Cánh cửa nhớ bà', content: 'Ngày cháu còn thấp bé\nCánh cửa có hai then\nCháu chỉ cài then dưới\nNhớ bà cài then trên\n\nMỗi năm cháu lớn lên\nBà lưng còng cắm cúi\nCháu cài được then trên\nBà chỉ cài then dưới...\n\nNay cháu về nhà mới\nBao cánh cửa – ô trời\nMỗi lần tay đẩy cửa\nLại nhớ bà khôn nguôi.' },
    { id: 30, volume: 1, title: 'Bài 30: Thương ông', content: '(Trích)\nÔng bị đau chân\nNó sưng nó tấy,\nĐi phải chống gậy\nKhập khiễng, khập khà.\n\nBước lên thềm nhà\nNhấc chân quá khó,\nThấy ông nhăn nhó\nViệt chơi ngoài sân\nLon ton lại gần,\nÂu yếm, nhanh nhảu:\n– Ông vịn vai cháu,\nCháu đỡ ông lên.\n\nÔng bước lên thềm\nTrong lòng sung sướng,\nQuẳng gậy, cúi xuống\nQuên cả đớn đau,\nÔm cháu xoa đầu:\n– Hoan hô thằng bé!\nBé thế mà khoẻ\nVì nó thương ông.' },
    { id: 31, volume: 1, title: 'Bài 31: Ánh sáng của yêu thương', content: 'Hôm ấy, bố vắng nhà, mẹ bị đau bụng dữ dội. Ê-đi-xơn liền chạy đi mời bác sĩ.\nBác sĩ đến khám bệnh và cho biết mẹ của Ê-đi-xơn đau ruột thừa, phải mổ gấp. Nhưng trời cứ tối dần, với ánh đèn dầu tù mù, chẳng thể làm gì được. Ê-đi-xơn lo lắng. Thấy mẹ đau đớn, cậu mếu máo: “Xin bác sĩ cứu mẹ cháu!”. Bác sĩ ái ngại nói: “Đủ ánh sáng, bác mới mổ được cháu ạ!”.\nThương mẹ, Ê-đi-xơn ôm đầu suy nghĩ. Làm thế nào để cứu mẹ bây giờ? Đột nhiên, cậu trông thấy ánh sáng của ngọn đèn hắt lại từ mảnh sắt tây trên tủ. Nét mặt cậu rạng rỡ hẳn lên. Ê-đi-xơn vội chạy sang nhà hàng xóm, mượn về một tấm gương. Lát sau, đèn nến trong nhà được cậu thắp lên và đặt trước gương. Căn phòng bỗng ngập tràn ánh sáng.\nNhìn căn phòng sáng trưng, bác sĩ rất ngạc nhiên, bắt tay ngay vào việc. Ca mổ thành công, mẹ của Ê-đi-xơn đã được cứu sống.' },
    { id: 32, volume: 1, title: 'Bài 32: Chơi chong chóng', content: 'An yêu thích những chiếc chong chóng giấy. Mỗi chiếc chong chóng chỉ có một cái cán nhỏ và dài, một đầu gắn bốn cánh giấy mỏng, xinh như một bông hoa. Nhưng mỗi lần quay, nó mang lại bao nhiêu là tiếng cười và sự háo hức. An thích chạy thật nhanh để những cánh giấy không ngừng quay trong gió. Gió lướt qua cánh chong chóng tạo ra tiếng u u rạt lạ.\nAn thường rủ bé Mai chơi chong chóng và thi xem ai thắng. Hai anh em chạy quanh sân cho chong chóng quay, rồi đột ngột dừng lại. Chong chóng của ai dùng quay trước thì người đó thua. An chạy nhanh hơn nên chong chóng quay lâu hơn. Thua, Mai buồn thiu. An liền cho em giơ chong chóng ra trước quạt máy, còn mình thì phồng má thổi phù phù cho chong chóng quay. Mai cười toe toét. Bây giờ, cũng giống như anh, Mai cũng rất mê những chiếc chong chóng.' },
    // TẬP 2
    { id: 33, volume: 2, title: 'Bài 1: Chuyện bốn mùa', content: 'Ngày đầu năm, bốn nàng tiên Xuân, Hạ, Thu, Đông gặp nhau. Đông cầm tay Xuân bảo:\n– Chị là người sung sướng nhất. Ai cũng yêu chị. Chị về, cây nào cũng đâm chồi nảy lộc.\nXuân nói:\n– Nhưng nhờ có em Hạ, cây trong vườn mới đơm trái ngọt, học sinh mới được nghỉ hè.\nNàng Hạ tinh nghịch xen vào:\n– Thế mà thiếu nhi lại thích em Thu nhất. Không có Thu, làm sao có đêm trăng rằm rước đèn, phá cỗ,...\nGiọng buồn buồn, Đông nói:\n– Chỉ có em là chẳng ai yêu.\nThu đặt tay lên vai Đông, thủ thỉ:\n– Có em mới có bập bùng bếp lửa nhà sàn, mọi người mới có giấc ngủ ấm trong chăn.\n\nBốn nàng tiên mải chuyện trò, không biết bà Đất đã đến từ lúc nào. Bà nói:\n– Xuân làm cho cây lá tươi tốt. Hạ cho trái ngọt, hoa thơm. Thu làm cho trời xanh cao, học sinh nhớ ngày tựu trường. Còn cháu Đông, cháu có công ấp ủ mầm sống để xuân về cây cối đâm chồi nảy lộc. Các cháu đều có ích, đều đáng yêu.' },
    { id: 34, volume: 2, title: 'Bài 2: Mùa nước nổi', content: 'Mùa này, người làng tôi gọi là mùa nước nổi, không gọi là mùa nước lũ, vì nước lên hiền hoà. Nước mỗi ngày một dâng lên. Mưa dầm dề, mưa suốt mười ngày này qua ngày khác.\nRồi đến Rằm tháng Bảy. “Rằm tháng Bảy nước nhảy lên bờ”. Dòng sông Cửu Long đã no đầy, lại tràn qua bờ. Nước trong ao hồ, trong đồng ruộng của mùa mưa hoà lẫn với nước của dòng sông Cửu Long.\nĐồng ruộng, vườn tược và cây cỏ như biết giữ lại hạt phù sa ở quanh mình, nước lại trong dần. Ngồi trong nhà, ta thấy cả những đàn cá ròng ròng, từng đàn, từng đàn theo cá mẹ xuôi theo dòng nước, vào tận đồng sâu.\nNgủ một đêm, sáng dậy, nước ngập lên những viên gạch. Phải lấy ván, lấy tre làm cầu từ cửa trước vào đến tận bếp. Vui quá! Có cả một cây cầu lắt lẻo ngay dưới mái nhà.' },
    { id: 35, volume: 2, title: 'Bài 3: Hoạ mi hót', content: 'Mùa xuân! Mỗi khi hoạ mi cất lên những tiếng hót vang lừng, mọi vật như có sự thay đổi kì diệu.\nTrời bỗng sáng thêm ra. Những luồng sáng chiếu qua các chùm lộc mới nhú, rực rỡ hơn. Những gợn sóng trên hồ hoà nhịp với tiếng hoạ mi hót, lấp lánh thêm. Da trời bỗng xanh hơn, những làn mây trắng trôi nhanh hơn, xốp hơn, trôi nhẹ nhàng hơn. Các loài hoa nghe tiếng hót trong suốt của hoạ mi chợt bừng giấc, xoè những cánh hoa đẹp, bày đủ các màu sắc xanh tươi. Tiếng hót dìu dặt của hoạ mi giục các loài chim dạo lên những khúc nhạc tưng bừng, ngợi ca núi sông đang đổi mới.\nChim, mây, nước và hoa đều cho rằng tiếng hót kì diệu của hoạ mi đã làm cho tất cả bừng tỉnh giấc... Hoạ mi thấy lòng vui sướng, cố hót hay hơn.' },
    { id: 36, volume: 2, title: 'Bài 4: Tết đến rồi', content: 'Tết là khởi đầu cho một năm mới, là dịp lễ được mong chờ nhất trong năm.\nVào dịp Tết, các gia đình thường gói bánh chưng hoặc bánh tét. Bánh chưng hình vuông, gói bằng lá dong. Bánh tét hình trụ, thường gói bằng lá chuối. Cả hai loại bánh đều làm từ gạo nếp, đỗ xanh, thịt lợn.\nMai và đào là những loài hoa đặc trưng cho Tết ở hai miền Nam, Bắc. Hoa mai rực rỡ sắc vàng. Hoa đào thường có màu hồng tươi, xen lẫn lá xanh và nụ hồng chúm chím.\nNgày Tết, người lớn thường tặng trẻ em những bao lì xì xinh xắn, với mong ước các em mạnh khoẻ, giỏi giang. Tết là dịp mọi người quây quần bên nhau và dành cho nhau những lời chúc tốt đẹp.' },
    { id: 37, volume: 2, title: 'Bài 5: Giọt nước và biển lớn', content: 'Tí ta tí tách\nTừng giọt\nMưa rơi\nRơi rơi.\n\nGóp lại bao ngày\nThành dòng suối nhỏ\nLượn trên bãi cỏ\nChảy xuống chân đồi.\n\nSuối gặp bạn rồi\nGóp thành sông lớn\nSông đi ra biển\nBiển thành mênh mông.\n\nBiển ơi, có biết\nBiển lớn vô cùng\nTừng giọt nước trong\nLàm nên biển đấy!' },
    { id: 38, volume: 2, title: 'Bài 6: Mùa vàng', content: 'Thu về, những quả hồng đỏ mọng, những hạt dẻ nâu bóng, những quả na mở to mắt, thơm dịu dịu. Biển lúa vàng ươm. Gió nổi lên và sóng lúa vàng dập dờn trải tới chân trời.\n– Minh ơi, con thấy quả trên cây đều chín hết cả rồi. Các bạn ấy đang mong có người đến hái đấy. Nhìn quả chín ngon thế này, chắc các bác nông dân vui lắm mẹ nhỉ?\n– Đúng thế con ạ.\n– Nếu mùa nào cũng được thu hoạch thì thích lắm, phải không mẹ?\nMẹ âu yếm nhìn Minh và bảo:\n– Con nói đúng đấy! Mùa nào thức ấy.\nNhưng để có sản phẩm thu hoạch, trước đó người nông dân phải làm rất nhiều việc. Họ phải cày bừa, gieo hạt và ươm mầm. Rồi mưa nắng, hạn hán, họ phải chăm sóc vườn cây, ruộng đồng. Nhờ thế mà cây lớn dần, ra hoa kết trái và chín rộ đấy.\n– Mẹ ơi, con hiểu rồi. Công việc của các bác nông dân vất vả quá mẹ nhỉ?' },
    { id: 39, volume: 2, title: 'Bài 7: Hạt thóc', content: '(Là hạt gì?)\nHẠT THÓC\nTôi chỉ là hạt thóc\nSinh ra trên cánh đồng\nGiấu trong mình câu chuyện\nMột cuộc đời bão giông.\n\nTôi ngấm ánh nắng sớm\nTôi uống giọt sương mai\nTôi sống qua bão lũ\nTôi chịu nhiều thiên tai.\n\nDẫu hình hài bé nhỏ\nTôi trải cả bốn mùa\nDẫu bây giờ bình dị\nTôi có từ ngàn xưa.\n\nTôi chỉ là hạt thóc\nKhông biết hát biết cười\nNhưng tôi luôn có ích\nVì nuôi sống con người.' },
    { id: 40, volume: 2, title: 'Bài 8: Luỹ tre', content: 'Mỗi sớm mai thức dậy\nLuỹ tre xanh rì rào\nNgọn tre cong gọng vó\nKéo mặt trời lên cao.\n\nNhững trưa đồng đầy nắng\nTrâu nằm nhai bóng râm\nTre bần thần nhớ gió\nChợt về đầy tiếng chim.\n\nMặt trời xuống núi ngủ\nTre nâng vầng trăng lên\nSao, sao treo đầy cành\nSuốt đêm dài thắp sáng.\n\nBỗng gà lên tiếng gáy\nXôn xao ngoài luỹ tre\nĐêm chuyển dần về sáng\nMầm măng đợi nắng về.' },
    { id: 41, volume: 2, title: 'Bài 9: Ve chim', content: 'Hay chạy lon xon\nLà gà mới nở\nVừa đi vừa nhảy\nLà em sáo xinh\nHay nói linh tinh\nLà con liếu điếu\nHay nghịch hay tếu\nLà cậu chìa vôi\nHay chao đớp mồi\nLà chim chèo bẻo\nTính hay mách lẻo\nThím khách trước nhà\nHay nhặt lân la\nLà bà chim sẻ\nCó tình có nghĩa\nLà mẹ chim sâu\nGiục hè đến mau\nLà cô tu hú\nNhấp nhem buồn ngủ\nLà bác cú mèo...' },
    { id: 42, volume: 2, title: 'Bài 10: Khủng long', content: 'Khủng long là loài vật thường sống thành bầy đàn ở các vùng đất khô.\nTrong suy nghĩ của nhiều người, khủng long là loài vật khổng lồ. Nhưng trên thực tế, có loài khủng long chỉ bằng một chú chó nhỏ. Khủng long thường ăn thịt, cũng có một số loài ăn cỏ.\nChân khủng long thẳng và rất khoẻ. Vì thế chúng có thể đi khắp vùng rộng lớn để kiếm ăn. Khủng long có khả năng săn mồi tốt nhờ có đôi mắt tinh tường cùng cái mũi và đôi tai thính. Khủng long cũng có khả năng tự vệ tốt nhờ vào cái đầu cứng và cái quất đuôi dũng mãnh.\nTrước khi con người xuất hiện, khủng long đã bị tuyệt chủng. Vì thế, chúng ta sẽ không bao giờ có thể nhìn thấy khủng long thật.' },
    { id: 43, volume: 2, title: 'Bài 11: Sự tích cây thì là', content: 'Ngày xưa, cây cối trên trái đất chưa có tên gọi. Trời bèn gọi chúng lên để đặt tên. Cây cối mừng rỡ kéo nhau lên trời. Trời chỉ tay vào từng cây và đặt tên:\n– Chú thì ta đặt tên cho là cây dừa.\n– Chú thì ta đặt tên cho là cây cau.\n– Chú là cây tỏi…\nTrời đặt tên mãi mà vẫn chưa hết. Về sau, Trời chỉ nói vắn tắt:\n– Chú là cây cải.\n– Chú là cây ớt.\nKhi các loài cây đều đã có tên, bỗng một cái cây dáng mảnh khảnh, lá nhỏ xíu đến xin đặt tên.\n– Chú bé tí xíu, chú có ích gì để ta đặt tên nào? – Trời hỏi.\nCây nhỏ liền thưa:\n– Thưa Trời, khi nấu canh riêu cá hoặc làm chả cá, chả mực mà không có con thì mất cả ngon ạ.\nTrời liền bảo:\n– Ừ, để ta nghĩ cho một cái tên. Tên chú thì… là… thì… là…\nTrời còn đang suy nghĩ, cây nhỏ đã chạy đi xa rồi. Nó mừng rỡ khoe với bạn bè:\n– Trời đặt tên cho tôi là cây “thì là” đấy!' },
    { id: 44, volume: 2, title: 'Bài 12: Bờ tre đón khách', content: 'Bờ tre quanh hồ\nSuốt ngày đón khách\nMột đàn cò bạch\nHạ cánh reo mừng\nTre chợt tưng bừng\nNở đầy hoa trắng.\n\nĐến chơi im lặng\nCó bác bồ nông\nĐứng nhìn mênh mông\nIm như tượng đá.\n\nMột chú bói cá\nĐỗ xuống cành mềm\nChú vụt bay lên\nĐậu vào chỗ cũ.\n\nGhé chơi đông đủ\nCả toán chim cu\nCa hát gật gù:\n“Ồ, tre rất mát!”.\n\nKhách còn chú ếch\nÌ oạp vang lừng\nGọi sao tung bừng\nLúc ngày vừa tắt.' },
    { id: 45, volume: 2, title: 'Bài 13: Tiếng chổi tre', content: 'Những đêm hè\nKhi ve ve\nĐã ngủ\nTôi lắng nghe\nTrên đường Trần Phú\nTiếng chổi tre\nXao xác\nHàng me\nTiếng chổi tre\nĐêm hè\nQuét rác...\n\nNhững đêm đông\nKhi cơn dông\nVừa tắt\nTôi lắng nghe\nTrên đường lạng ngắt\nTiếng chổi tre\nChị lao công\nNhư sắt\nNhư đồng\nChị lao công\nĐêm đông\nQuét rác...\n\nNhớ em nghe\nTiếng chổi tre\nChị quét\nNhững đêm hè\nĐêm đông gió rét\nTiếng chổi tre\nSớm tối\nĐi về\nGiữ sạch lề\nĐẹp lối\nEm nghe!' },
    { id: 46, volume: 2, title: 'Bài 14: Cò non cười rồi', content: 'Mùa xuân đã đến. Cỏ trong công viên bừng tỉnh sau giấc ngủ đông. Từng đàn én én từ phương Nam trở về. Trẻ em chơi đùa dưới ánh mặt trời ấm áp.\nMột hôm, chị én nâu đang sửa soạn đi ngủ thì nghe thấy tiếng khóc thút thít. Lần theo tiếng khóc, én nâu tìm đến công viên nhỏ. Thấy một cây cỏ non đang khóc, én nâu hỏi:\n– Em bị ốm à?\nCỏ non khóc nức lên:\n– Chị ơi, em không đứng thẳng được nữa. Các bạn nhỏ đã đến đây chơi đùa và giẫm lên em.\nÉn nâu lặng đi một phút rồi rồi bỗng reo lên:\n– Đừng khóc nữa! Chị sẽ giúp em.\nThế rồi, én nâu gọi thêm rất nhiều bạn của mình. Suốt đêm, cả đàn én ra sức đi tìm cỏ khô tết thành dòng chữ “Không giẫm chân lên cỏ!” đặt bên cạnh bãi cỏ. Xong việc, én nâu tươi cười bảo cỏ non:\n– Từ nay em yên tâm rồi. Không còn ai giẫm lên em nữa đâu.\nCỏ non nhoẻn miệng cười và cảm ơn chị én nâu.' },
    { id: 47, volume: 2, title: 'Bài 15: Những con sao biển', content: 'Một người đàn ông đang dạo bộ trên bãi biển khi chiều xuống. Biển đông người, nhưng ông lại chú ý đến một cậu bé cứ liên tục cúi xuống nhặt thứ gì đó rồi thả xuống biển.\nTiến lại gần hơn, ông thấy cậu bé đang nhặt những con sao biển bị thuỷ triều đánh dạt lên bờ và thả chúng trở về với đại dương.\n– Cháu đang làm gì vậy? – Người đàn ông hỏi.\nCậu bé trả lời:\n– Những con sao biển này sắp chết vì thiếu nước, cháu muốn giúp chúng.\n– Có hàng ngàn con sao biển như vậy, liệu cháu có thể giúp được tất cả chúng không?\nCậu bé vẫn tiếp tục nhặt những con sao biển khác thả xuống biển và nói với người đàn ông:\n– Cháu cũng biết như vậy, nhưng ít nhất thì cháu cũng cứu được những con sao biển này.\nNgười đàn ông trìu mến nhìn cậu bé và cùng cậu cứu những con sao biển.' },
    { id: 48, volume: 2, title: 'Bài 16: Tạm biệt cánh cam', content: 'Chú cánh cam đi lạc vào nhà Bống. Chân chú bị thương, bước đi tập tễnh. Bống thương quá, đặt cánh cam vào một chiếc lọ nhỏ đựng đầy cỏ. Từ ngày đó, cánh cam trở thành người bạn nhỏ xíu của Bống.\nCánh cam có đôi cánh xanh biếc, óng ánh dưới ánh nắng mặt trời. Mỗi khi nghe tiếng động, chú khẽ hệ ôm cái bụng tròn lẳn, trốn vào đám cỏ rối. Bống chăm sóc cánh cam rất cẩn thận. Hằng ngày, em đều bỏ vào chiếc lọ một chút nước và những ngọn cỏ xanh non.\nNhưng Bống cảm thấy cánh cam vẫn có vẻ ngơ ngác không vui, chắc chú nhớ nhà và nhớ bạn bè. Đoán vậy, Bống mang cánh cam thả ra bãi cỏ sau nhà. Tạm biệt cánh cam bé nhỏ, Bống hi vọng chú sẽ tìm được đường về căn nhà thân thương của mình.' },
    { id: 49, volume: 2, title: 'Bài 17: Những cách chào độc đáo', content: 'Trên thế giới có những cách chào phổ biến như bắt tay, vẫy tay và cúi chào. Ngoài ra, người ta còn có những cách chào nhau rất đặc biệt.\nNgười Ma-ô-ri ở Niu Di-lân chào bằng cách nhẹ nhàng chạm mũi và trán vào nhau. Người Ấn Độ thì chắp hai tay trước ngực, kèm theo một cái cúi đầu. Nhiều người ở Mỹ thì chào bằng cách nắm bàn tay lại và đấm nhẹ vào nắm tay người kia. Còn người Dim-ba-bu-ê lại chào theo cách truyền thống là vỗ tay,... Mỗi cách chào thể hiện một nét riêng trong giao tiếp của người dân ở từng nước.\nCòn em, em chào bạn bằng cách nào?' },
    { id: 50, volume: 2, title: 'Bài 18: Thư viện biết đi', content: 'Thư viện là nơi lưu giữ sách báo, nơi mọi người đến đọc sách hoặc mượn sách về nhà. Nhiều người nghĩ rằng thư viện chỉ nằm im một chỗ. Nhưng trên thế giới, có rất nhiều “thư viện biết đi”.\nThư viện Lô-gô-xơ của Đức là “thư viện nổi” lớn nhất thế giới. Nó nằm trên một con tàu biển khổng lồ, có thể chở được 500 hành khách và đã từng đi qua 45 nước trên thế giới.\nỞ Phần Lan, có hàng trăm “thư viện di động” trên những chiếc xe buýt cũ, chạy khắp các thành phố lớn. Ở châu Phi, một người thủ thư đã đặt thư viện trên lưng một con lạc đà. Nhờ thế, những cuốn sách có thể băng qua sa mạc để đến với người đọc.' },
    { id: 51, volume: 2, title: 'Bài 19: Cảm ơn anh hà mã', content: 'Dê rủ cún con vào rừng chơi, khi quay về thì bị lạc đường. Gặp cô hươu, dê hỏi:\n– Cô kia, về làng đi lối nào?\n– Không biết. – Hươu lắc đầu, bỏ đi.\nĐi tiếp, tới một con sông, thấy anh hà mã, dê nói to:\n– Bọn tôi muốn về làng, hãy đưa bọn tôi qua sông!\nHà mã phật ý, định bỏ đi. Thấy vậy, cún nói:\n– Chào anh hà mã, anh giúp bọn em qua sông được không ạ?\n– Được chứ! Em ngoan quá! – Hà mã vui vẻ nói.\n– Cảm ơn anh! – Cún đáp rồi quay sang nói nhỏ với dê:\n– Cậu quên lời cô dặn rồi à? Muốn ai đó giúp, phải hỏi một cách lịch sự, còn khi họ giúp mình, phải nói “cảm ơn”.\nDê con hơi xấu hổ. Sang bên kia sông, dê nói với hà mã:\n– Cảm ơn anh đã giúp. Em biết mình sai rồi. Em xin lỗi ạ!\nHà mã mỉm cười:\n– Em biết lỗi là tốt rồi. Giờ các em cứ đi theo đường này là về làng thôi.' },
    { id: 52, volume: 2, title: 'Bài 20: Từ chú bồ câu đến in-tơ-nét', content: 'Ngoài trò chuyện trực tiếp, con người còn nghĩ ra rất nhiều cách để trao đổi với nhau khi ở xa.\nTừ xa xưa, người ta đã biết huấn luyện bồ câu để đưa thư. Bồ câu nhớ đường rất tốt. Nó có thể bay qua một chặng đường dài hàng nghìn cây số để mang thư đến đúng nơi nhận.\nNhững người đi biển còn nghĩ ra cách bỏ thư vào trong những chiếc chai thuỷ tinh. Nhờ sóng biển, những chiếc chai này được đẩy vào đất liền. Có những bức thư vài chục năm sau mới được tìm thấy.\nNgày nay, việc trao đổi thông tin dễ dàng hơn rất nhiều. Nhờ có in-tơ-nét, bạn cũng có thể nhìn thấy người nói chuyện với mình, dù hai người đang ở cách nhau rất xa.' },
    { id: 53, volume: 2, title: 'Bài 21: Mai An Tiêm', content: 'Ngày xưa, có một người tên là Mai An Tiêm được vua Hùng yêu mến nhận làm con nuôi. Một lần, vì hiểu lầm lời nói của An Tiêm nên nhà vua nổi giận, đày An Tiêm ra đảo hoang.\nỞ đảo hoang, hai vợ chồng An Tiêm dựng nhà bằng tre nứa, lấy cỏ phơi khô tết thành quần áo.\nMột hôm, An Tiêm thấy một đàn chim bay qua thả xuống loại hạt đen nhánh. Chàng bèn nhặt và gieo xuống cát, thầm nghĩ: “Thứ quả này chim ăn được thì người cũng ăn được”.\nRồi hạt nảy mầm, vươn thành một loại cây dây bò lan rộng. Cây ra hoa rồi ra quả. Quả có vỏ màu xanh thẫm, ruột đỏ, hạt đen nhánh, có vị ngọt và mát. Vợ chồng An Tiêm đem hạt gieo trồng khắp đảo.\nMùa quả chín, nhớ vua cha, An Tiêm khắc tên mình vào quả, thả xuống biển, nhờ sóng đưa vào đất liền. Một người dân vớt được quả lạ đem dâng vua. Vua hối hận cho đón vợ chồng An Tiêm trở về.\nThứ quả lạ đó là giống dưa hấu ngày nay.' },
    { id: 54, volume: 2, title: 'Bài 22: Thư gửi bố ngoài đảo', content: '(Trích)\nBây giờ sắp Tết rồi\nCon viết thư gửi bố (...)\nTết con muốn gửi bố\nCái bánh chưng cho vui\nNhưng bánh thì to quá\nMà hòm thư nhỏ thôi.\n\nGửi hoa lại sợ héo\nĐường ra đảo xa xôi\nCon viết thư gửi vậy\nHẳn bố bằng lòng thôi.\n\nNgoài ấy chắc nhiều gió\nĐảo không có gì che\nNgoài ấy chắc nhiều sóng\nBố lúc nào cũng nghe.\n\nBà bảo: hàng rào biển\nLà bố đấy, bố ơi\nCùng các chú bạn bố\nGiữ đảo và giữ trời.' },
    { id: 55, volume: 2, title: 'Bài 23: Bóp nát quả cam', content: 'Giặc Nguyên cho sứ thần sang giả vờ mượn đường để xâm chiếm nước ta. Thấy sứ giặc ngang ngược, Trần Quốc Toản vô cùng căm giận.\nBiết vua họp bàn việc nước dưới thuyền rồng, Quốc Toản quyết định gặp để xin vua quyết đánh. Đợi mãi không gặp được vua, cậu liều chết xô mấy người lính gác, xăm xăm xuống bến.\nGặp vua, Quốc Toản quỳ xuống tâu:\n– Cho giặc mượn đường là mất nước. Xin bệ hạ cho đánh!\nNói xong, cậu tự đặt thanh gươm lên gáy, xin chịu tội.\nVua cho Quốc Toản đứng dậy, ôn tồn bảo:\n– Quốc Toản làm trái phép nước, lẽ ra phải trị tội. Nhưng còn trẻ mà đã biết lo việc nước, ta có lời khen.\nNói rồi, vua ban cho Quốc Toản một quả cam.\nQuốc Toản ấm ức bước lên bờ: “Vua ban cho cam quý nhưng xem ta như trẻ con, không cho dự bàn việc nước.”. Nghĩ đến quân giặc ngang ngược, cậu nghiến răng, hai bàn tay bóp chặt.\nKhi trở ra, Quốc Toản xoè tay cho mọi người xem cam quý. Nhưng quả cam đã nát từ bao giờ.' },
    { id: 56, volume: 2, title: 'Bài 24: Chiếc rễ đa tròn', content: 'Một sớm hôm ấy, như thường lệ, Bác Hồ đi dạo trong vườn. Đến gần cây đa, Bác chợt thấy một chiếc rễ đa nhỏ và dài ngoằn ngoèo trên mặt đất. Chắc là trận gió đêm qua đã làm nó rơi xuống. Bác tần ngần một lát, rồi nói với chú cần vụ:\n– Chú cuộn chiếc rễ này lại, rồi trồng cho nó mọc tiếp nhé!\nTheo lời Bác, chú cần vụ xới đất, vùi chiếc rễ xuống. Thấy vậy, Bác ân cần bảo:\n– Chú nên làm thế này.\nNói rồi, Bác cuộn chiếc rễ thành một vòng tròn, cùng chú cần vụ buộc nó tựa vào hai cái cọc, sau đó mới vùi hai đầu rễ xuống đất.\nChú cần vụ thắc mắc:\n– Thưa Bác, Bác làm thế để làm gì ạ?\nBác khẽ cười:\n– Rồi chú sẽ biết.\nNhiều năm sau, chiếc rễ đã lớn và thành cây đa con có vòng lá tròn. Thiếu nhi vào thăm vườn Bác, em nào cũng thích chơi trò chui qua chui lại vòng lá ấy. Lúc đó, mọi người mới hiểu vì sao Bác cho trồng chiếc rễ đa thành hình tròn như thế.' },
    { id: 57, volume: 2, title: 'Bài 25: Đất nước chúng mình', content: 'Việt Nam là đất nước tươi đẹp của chúng mình. Thủ đô nước mình là Hà Nội. Lá cờ Tổ quốc hình chữ nhật, nền đỏ, ở giữa có ngôi sao vàng năm cánh.\nViệt Nam có những vị anh hùng có công lớn với đất nước như Hai Bà Trưng, Bà Triệu, Trần Hưng Đạo, Quang Trung, Hồ Chí Minh,... Những con người ấy đã làm rạng danh lịch sử nước nhà.\nĐất nước mình có ba miền Bắc, Trung, Nam với khí hậu khác nhau. Miền Bắc một năm có bốn mùa: xuân, hạ, thu, đông. Miền Nam có hai mùa: mùa mưa và mùa khô. Miền Trung có nơi giống miền Bắc, có nơi giống miền Nam.\nTrang phục truyền thống của người Việt Nam là áo dài. Áo dài thường được mặc dịp Tết hoặc lễ hội.' },
    { id: 58, volume: 2, title: 'Bài 26: Trên các miền đất nước', content: 'Đất nước Việt Nam thật tươi đẹp. Hãy cùng nhau đi thăm các miền đất nước qua những câu ca dao.\nĐầu tiên, chúng ta sẽ đến Phú Thọ, miền Bắc nước ta, nơi có đền thờ Vua Hùng, nơi được gọi là “quê cha đất tổ”:\nDù ai đi ngược về xuôi\nNhớ ngày Giỗ Tổ mùng Mười tháng Ba.\nTiếp đến, chúng ta cùng vào miền Trung:\nĐường vô xứ Nghệ quanh quanh\nNon xanh nước biếc như tranh hoạ đồ.\nVà chúng ta cũng khám phá miền Nam Bộ:\nĐồng Tháp Mười cò bay thẳng cánh\nNước Tháp Mười lóng lánh cá tôm.\nVậy là chúng ta đã đi qua ba miền Bắc, Trung, Nam của đất nước. Nơi nào cũng để lại bao tình cảm mến thương.' },
    { id: 59, volume: 2, title: 'Bài 27: Chuyện quả bầu', content: 'Ngày xưa có vợ chồng nọ đi rừng, bắt được một con dúi. Dúi xin tha, họ thương tình tha cho nó.\nĐể trả ơn, dúi báo sắp có lũ lụt rất lớn và chỉ cho họ cách tránh. Họ nói với bà con nhưng chẳng ai tin. Nghe lời dúi, họ khoét rỗng khúc gỗ to, chuẩn bị thức ăn bỏ vào đó. Vừa chuẩn bị xong mọi thứ thì mưa to, gió lớn, nước ngập mênh mông. Muôn loài chìm trong biển nước. Nhờ sống trong khúc gỗ nổi, vợ chồng nhà nọ thoát nạn.\nÍt lâu sau, người vợ sinh ra một quả bầu.\nMột hôm, đi làm nương về, họ nghe tiếng cười đùa từ gác bếp để quả bầu. Thấy lạ, họ lấy quả bầu xuống, áp tai nghe thì có tiếng lao xao. Người vợ bèn lấy que dùi quả bầu. Lạ thay, từ trong quả bầu, những con người bé nhỏ bước ra. Người Khơ Mú ra trước. Tiếp đến, người Thái, người Mường, người Dao, người Mông, người Ê-đê, người Ba-na, người Kinh,… lần lượt ra theo.\nĐó là tổ tiên của các dân tộc anh em trên đất nước ta ngày nay.' },
    { id: 60, volume: 2, title: 'Bài 28: Khám phá đáy biển ở Trường Sa', content: 'Nhắc đến Trường Sa, ngoài các đảo, người ta nhắc đến biển. Mà biển thì có muôn vàn điều kì thú. Thám hiểm đáy biển ở Trường Sa của nước ta sẽ thấy bao điều thú vị.\nBiển ở Trường Sa có những loài cá đẹp rực rỡ và lạ mắt. Từng đàn cá đủ màu sắc, dày đặc đến hàng trăm con tạo nên một tấm thảm hoa di động. Những vỉa san hô chạy dài từ chân mỗi đảo xuống sâu dần dưới đáy biển. San hô làm cho đáy biển trông như một bức tranh khổng lồ, đẹp như những toà lâu đài trong truyện cổ tích.\nTrường Sa là vùng biển thân yêu của Tổ quốc, có cảnh đẹp kì thú và hàng nghìn loài vật sống dưới biển.' },
    { id: 61, volume: 2, title: 'Bài 29: Hồ Gươm', content: 'Nhà tôi ở Hà Nội, cách Hồ Gươm không xa. Từ trên cao nhìn xuống, mặt hồ như một chiếc gương bầu dục lớn, sáng long lanh.\nCầu Thê Húc màu son, cong cong như con tôm, dẫn vào đền Ngọc Sơn. Mái đền lấp ló bên gốc đa già, rễ lá xum xuê. Xa một chút là Tháp Rùa, tường rêu cổ kính. Tháp xây trên gò đất giữa hồ, cỏ mọc xanh um.\nBuổi người ta thấy có con rùa lớn, đầu to như trái bưởi, nhô lên khỏi mặt nước. Rùa như lắng nghe tiếng chuông đồng hồ trên tầng cao nhà bưu điện, buông từng tiếng ngân nga trong gió. Tôi thầm nghĩ: không biết có phải rùa đã từng ngậm thanh kiếm của vua Lê thắng giặc đó không?' },
    { id: 62, volume: 2, title: 'Bài 30: Cánh đồng quê em', content: 'Bé theo mẹ ra đồng\nVầng dương lên rực đỏ\nMuôn vàn kim cương nhỏ\nLấp lánh ngọn cỏ hoa.\n\nNắng ban mai hiền hoà\nTung lụa tơ vàng óng\nTrải lên muôn con sóng\nDập dờn đồng lúa xanh.\n\nĐàn chiền chiện bay quanh\nHót tích ri tích rích\nLũ châu chấu tinh nghịch\nĐu cỏ uống sương rơi.\n\nSóng xanh cuộn chân trời\nCánh đồng như tranh vẽ\nBé ngân nga hát khẽ\nTrong hương lúa mênh mông.' }
];

// --- Inlined from services/geminiService.ts ---
let ai;
let geminiInitializationError = null;

try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
    console.error("Lỗi khởi tạo Gemini AI:", e);
    geminiInitializationError = "Không thể khởi tạo dịch vụ AI. Vui lòng đảm bảo API Key đã được cấu hình đúng trong môi trường.";
}

const schema = {
    type: Type.OBJECT,
    properties: {
        docDayDu: { type: Type.BOOLEAN, description: 'Học sinh có đọc hết hoặc gần hết bài không? (true nếu đọc trên 80% bài, false nếu ngược lại)' },
        tongDiem: { type: Type.NUMBER, description: 'Tổng điểm đánh giá trên thang 100' },
        doLuuLoat: { type: Type.NUMBER, description: 'Điểm lưu loát trên thang 100' },
        phatAm: { type: Type.NUMBER, description: 'Điểm phát âm trên thang 100' },
        doChinhXac: { type: Type.NUMBER, description: 'Điểm chính xác (đọc đúng chữ) trên thang 100' },
        nhanXetChung: { type: Type.STRING, description: 'Nhận xét chung ngắn gọn về bài đọc của học sinh' },
        tuPhatAmSai: {
            type: Type.ARRAY,
            description: 'Danh sách các từ học sinh phát âm sai. Ghi lại từ học sinh đọc sai dựa trên âm thanh nghe được.',
            items: {
                type: Type.OBJECT,
                properties: {
                    tu: { type: Type.STRING, description: 'Từ gốc trong văn bản' },
                    phatAmSai: { type: Type.STRING, description: 'Từ mà học sinh đã phát âm sai (dựa trên audio)' },
                    suaLai: { type: Type.STRING, description: 'Cách phát âm đúng' },
                },
                required: ['tu', 'phatAmSai', 'suaLai'],
            },
        },
        diemTichCuc: {
            type: Type.ARRAY,
            description: 'Danh sách những điểm tích cực, lời khen dành cho học sinh',
            items: { type: Type.STRING },
        },
    },
    required: ['docDayDu', 'tongDiem', 'doLuuLoat', 'phatAm', 'doChinhXac', 'nhanXetChung', 'tuPhatAmSai', 'diemTichCuc'],
};


async function evaluateReading(passageText, audioBase64, mimeType) {
    if (geminiInitializationError) throw new Error(geminiInitializationError);
    try {
        const prompt = `Bạn là một giám khảo chấm thi đọc Tiếng Việt cho học sinh lớp 2, yêu cầu sự chính xác và nghiêm khắc.
        Nhiệm vụ của bạn là đánh giá khả năng đọc của một học sinh dựa trên đoạn văn gốc và file ghi âm.
        
        QUY TẮC BẮT BUỘC:
        1.  **Kiểm tra độ đầy đủ:** Đầu tiên, xác định học sinh có đọc hết bài không. Nếu học sinh chỉ đọc dưới 80% bài, hãy đặt "docDayDu" thành false, cho tất cả các điểm thành 0, và đặt "nhanXetChung" là "Em chưa đọc hết bài. Vui lòng đọc lại toàn bộ bài để được chấm điểm nhé.". Trong trường hợp này, không cần nhận xét gì thêm và trả về các mảng rỗng.
        2.  **Chấm điểm nghiêm ngặt (nếu đọc đủ bài):** Nếu "docDayDu" là true, hãy chấm điểm theo thang điểm 100 với các tiêu chí sau:
            - **Độ chính xác (tối đa 40 điểm):** Đây là phần quan trọng nhất. Mỗi lỗi đọc sai từ, thiếu từ, hoặc thừa từ so với văn bản gốc, trừ 2 điểm.
            - **Phát âm (tối đa 30 điểm):** Đánh giá sự tròn vành, rõ chữ. Trừ điểm nặng cho các lỗi phát âm phổ biến (l/n, s/x, tr/ch, r/d/gi, dấu hỏi/ngã). Mỗi lỗi trừ 1-2 điểm tùy mức độ.
            - **Độ lưu loát (tối đa 30 điểm):** Đánh giá tốc độ đọc phù hợp (khoảng 50-70 từ/phút), và việc ngắt nghỉ đúng ở dấu câu. Mỗi lần đọc vấp, ngập ngừng, lặp lại từ, trừ 1 điểm.
        3.  **Nhận xét:** Đưa ra nhận xét cụ thể. Với mỗi từ sai, hãy xác định chính xác học sinh đã đọc sai thành gì và điền vào trường "phatAmSai". Ví dụ, nếu từ gốc là "nói" và học sinh đọc là "lói", thì "tu" là "nói", "phatAmSai" là "lói", và "suaLai" là "nói".
        
        Đoạn văn gốc: "${passageText}"
        
        Hãy phân tích file ghi âm và trả về kết quả dưới dạng JSON theo schema đã cung cấp.`;

        const audioPart = {
            inlineData: {
                data: audioBase64,
                mimeType: mimeType,
            },
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, audioPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error('Error evaluating reading:', error);
        throw new Error('Không thể phân tích bài đọc. Vui lòng thử lại.');
    }
}

async function generateSpeech(text) {
    if (geminiInitializationError) throw new Error(geminiInitializationError);
    try {
        const instructedText = text;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: instructedText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        const base64Audio = audioPart?.inlineData?.data;

        if (!base64Audio) {
            console.error('TTS API did not return audio data. Response:', JSON.stringify(response, null, 2));
            throw new Error('Không nhận được dữ liệu âm thanh từ API.');
        }
        return base64Audio;
    } catch (error) {
        console.error('Error generating speech:', error);
        throw new Error('Không thể tạo giọng đọc mẫu. Vui lòng thử lại.');
    }
}

// --- Inlined from services/sheetService.ts ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaIW0K7t_0Nm5qA5_gycFydDoLWvlaItwk3obV7hjr7Hqx37luVBX7Y-SlsGbYgoRYRw/exec';

async function saveEvaluationToSheet(
  studentInfo,
  passage,
  result
) {
    if (!APPS_SCRIPT_URL) {
        console.warn('URL Google Apps Script chưa được cấu hình. Bỏ qua việc lưu vào Sheet.');
        throw new Error('URL_NOT_CONFIGURED');
    }

    const formData = new FormData();
    formData.append('name', studentInfo.name);
    formData.append('class', studentInfo.studentClass);
    formData.append('passageTitle', passage.title);
    formData.append('totalScore', result.tongDiem.toString());
    formData.append('fluency', result.doLuuLoat.toString());
    formData.append('pronunciation', result.phatAm.toString());
    formData.append('accuracy', result.doChinhXac.toString());
    formData.append('generalFeedback', result.nhanXetChung);
    formData.append('positivePoints', result.diemTichCuc.join('; '));
    formData.append('wordsToImprove', result.tuPhatAmSai.map(w => `${w.tu} -> ${w.suaLai}`).join('; '));

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();

        if (responseData.result !== 'success') {
            throw new Error(responseData.message || 'Lỗi không xác định từ Apps Script');
        }
    } catch (error) {
        console.error('Lỗi khi lưu vào Google Sheet:', error);
        throw new Error('Không thể lưu kết quả vào Google Sheet.');
    }
}

// --- Inlined from hooks/useAudioPlayer.ts ---
function decode(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data,
  ctx,
) {
  const sampleRate = 24000;
  const numChannels = 1;
  
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        // Prevent onended from firing when we manually stop.
        audioSourceRef.current.onended = null;
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore errors if the source was already stopped.
      }
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);
  
  const playAudio = useCallback(async (base64Audio) => {
    // Ensure context exists and is resumed. This is crucial for mobile browsers,
    // especially when the call is preceded by an `await`.
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      // FIX: Cast window to `any` to access vendor-prefixed webkitAudioContext without a TypeScript error.
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    // Stop any currently playing audio before starting a new one.
    stopAudio(); 

    try {
      setIsPlaying(true);
      const decodedBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        // Only update state if this specific source finished playing.
        // This prevents race conditions if another sound is played quickly.
        if (audioSourceRef.current === source) {
          setIsPlaying(false);
          audioSourceRef.current = null;
        }
      };
      source.start(0);
      audioSourceRef.current = source;
    } catch (error) {
        console.error('Failed to play audio:', error);
        setIsPlaying(false);
        audioSourceRef.current = null; // Clean up on error
        throw new Error('Không thể phát âm thanh.');
    }
  }, [stopAudio]);

  useEffect(() => {
    // Cleanup function to close the AudioContext when the component unmounts.
    return () => {
      stopAudio();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);

  return { isPlaying, playAudio, stopAudio };
}

// --- Inlined from hooks/useAudioRecorder.ts ---
function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)) {
        setError('Trình duyệt của bạn không hỗ trợ ghi âm. Vui lòng cập nhật hoặc dùng trình duyệt khác như Chrome, Firefox.');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstart = () => {
            setIsRecording(true);
            audioChunksRef.current = [];
        };

        mediaRecorder.start();

    } catch (err) {
        console.error('Error accessing microphone:', err);
        let message = 'Không thể truy cập micro. Vui lòng cấp quyền sử dụng micro trong trình duyệt.';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            message = 'Bạn đã không cấp quyền sử dụng micro. Vui lòng làm mới trang và cho phép ứng dụng truy cập micro.';
        } else if (err.name === 'NotFoundError') {
            message = 'Không tìm thấy thiết bị micro nào trên máy của bạn.';
        }
        setError(message);
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            // FIX: Add type check for reader.result as it can be ArrayBuffer, which doesn't have .split().
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1];
                resolve({ audioBase64: base64String, mimeType });
            } else {
                reject(new Error('Could not read audio file as base64 string.'));
            }
          };
          reader.onerror = (error) => {
              reject(error);
          };
          setIsRecording(false);
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.stop();
      } else {
        reject(new Error('Không có quá trình ghi âm nào đang diễn ra.'));
      }
    });
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, error };
}


// --- Inlined from components/Spinner.tsx ---
function Spinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100/50">
        <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
        <p className="text-blue-800 text-xl font-semibold mt-6">{message}</p>
    </div>
  );
}

// --- Inlined from components/WelcomeScreen.tsx ---
function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && studentClass.trim()) {
      onStart({ name, studentClass });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-yellow-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border">
        <div className="flex justify-center items-center gap-4 mb-4">
            <i className="fas fa-book-open text-5xl text-blue-500"></i>
            <i className="fas fa-microphone-alt text-5xl text-green-500"></i>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Luyện đọc Lớp 2</h1>
        <p className="text-gray-600 mb-8 text-lg">Cùng AI cải thiện kỹ năng đọc nhé!</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Họ và tên của em"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Lớp"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 text-xl rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!name.trim() || !studentClass.trim()}
          >
            Bắt đầu
          </button>
        </form>
      </div>
       <footer className="mt-8 text-gray-500">
          Sách Tiếng Việt 2 - Kết nối tri thức với cuộc sống
      </footer>
    </div>
  );
}

// --- Inlined from components/PassageList.tsx ---

// FIX: Define props via an interface to ensure TypeScript correctly handles React's special 'key' prop and avoids type errors during map rendering.
interface PassageCardProps {
    passage: Passage;
    onSelect: (passage: Passage) => void;
}

// FIX: Moved PassageCard outside of PassageList to prevent re-definition on every render, which can cause subtle rendering bugs.
// FIX: Explicitly type PassageCard as a React.FC to resolve type errors with the special 'key' prop in JSX.
const PassageCard: React.FC<PassageCardProps> = ({ passage, onSelect }) => (
    <button
        onClick={() => onSelect(passage)}
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-50 transition-all text-left transform hover:-translate-y-1 border border-gray-200"
    >
        <h2 className="text-xl font-bold text-blue-700">{passage.title}</h2>
        <p className="text-gray-500 mt-2 line-clamp-3 leading-snug">{passage.content}</p>
    </button>
);

// FIX: Added explicit types for the component's props. This resolves an error where the `onSelect` prop of PassageCard was being inferred as `any`, causing a type mismatch. The error about the 'key' prop is a side-effect of this initial type issue.
interface PassageListProps {
    studentInfo: StudentInfo;
    onSelectPassage: (passage: Passage) => void;
    onBackToWelcome: () => void;
}

function PassageList({ studentInfo, onSelectPassage, onBackToWelcome }: PassageListProps) {
  const passagesVol1 = READING_PASSAGES.filter(p => p.volume === 1);
  const passagesVol2 = READING_PASSAGES.filter(p => p.volume === 2);

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 p-4 bg-white rounded-xl shadow-lg flex justify-between items-center sticky top-4 z-10 border">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Chào, <span className="text-blue-600">{studentInfo.name}!</span></h1>
              <p className="text-gray-600">Hãy chọn một bài để bắt đầu luyện đọc nhé.</p>
            </div>
            <button onClick={onBackToWelcome} className="text-sm font-semibold text-gray-600 hover:text-blue-700 bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                <i className="fas fa-user-edit mr-2"></i>
                Đổi học sinh
            </button>
        </header>

        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-bold text-green-700 mb-6 border-l-4 border-green-500 pl-4">Tập 1</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {passagesVol1.map((passage) => (
                        <PassageCard key={passage.id} passage={passage} onSelect={onSelectPassage} />
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-purple-700 mb-6 border-l-4 border-purple-500 pl-4">Tập 2</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {passagesVol2.map((passage) => (
                        <PassageCard key={passage.id} passage={passage} onSelect={onSelectPassage} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- Inlined from components/ReadingView.tsx ---
function ReadingView({ passage, onBack, onFinishRecording }) {
  const { isRecording, startRecording, stopRecording, error: recorderError } = useAudioRecorder();
  const { isPlaying: isSamplePlaying, playAudio: playSampleAudio, stopAudio: stopSampleAudio } = useAudioPlayer();
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [ttsError, setTtsError] = useState(null);

  const handleListenSample = async () => {
    if (isGeneratingSpeech || isRecording) return;
    
    stopSampleAudio();
    setIsGeneratingSpeech(true);
    setTtsError(null);

    try {
        const audioBase64 = await generateSpeech(passage.content);
        await playSampleAudio(audioBase64);
    } catch (err) {
        setTtsError(err instanceof Error ? err.message : 'Lỗi không xác định khi tạo giọng đọc mẫu.');
    } finally {
        setIsGeneratingSpeech(false);
    }
  };

  const handleStart = async () => {
    stopSampleAudio();
    await startRecording();
  };

  const handleStop = async () => {
    try {
      const audio = await stopRecording();
      onFinishRecording(audio);
    } catch (err) {
      console.error('Error finishing recording:', err);
    }
  };
  
  const isBusy = isGeneratingSpeech || isSamplePlaying;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{passage.title}</h1>
          <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-semibold">
            <i className="fas fa-arrow-left mr-2"></i> Chọn bài khác
          </button>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg text-2xl leading-relaxed text-gray-800 mb-8 h-80 overflow-y-auto whitespace-pre-line border border-yellow-200 shadow-inner">
          {passage.content}
        </div>
        
        {(recorderError || ttsError) && <p className="text-red-600 text-center mb-4 font-semibold">{recorderError || ttsError}</p>}
        
        <div className="flex flex-col items-center">
          {!isRecording ? (
             <div className="flex items-center justify-center space-x-6">
              <button
                onClick={handleListenSample}
                disabled={isBusy}
                className="flex items-center justify-center w-48 h-16 bg-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGeneratingSpeech ? <i className="fas fa-spinner fa-spin"></i> : (isSamplePlaying ? <i className="fas fa-wave-square animate-pulse"></i> : <><i className="fas fa-volume-up mr-2"></i> Nghe mẫu</>)}
              </button>
              <button
                onClick={handleStart}
                disabled={isBusy}
                className="flex items-center justify-center w-52 h-16 bg-green-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <i className="fas fa-microphone mr-3"></i>
                Bắt đầu đọc
              </button>
            </div>
          ) : (
            <button
              onClick={handleStop}
              className="relative flex items-center justify-center w-52 h-16 bg-red-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-red-600 transition transform hover:scale-105"
            >
              <span className="absolute h-full w-full rounded-full bg-red-500 animate-ping opacity-75"></span>
              <i className="fas fa-stop mr-3"></i>
              Nộp bài
            </button>
          )}
           <p className="text-gray-600 mt-4 h-5 text-center font-semibold text-lg">
            {isGeneratingSpeech && 'AI đang chuẩn bị giọng đọc mẫu...'}
            {isSamplePlaying && 'Đang phát bài đọc mẫu...'}
            {!isGeneratingSpeech && !isSamplePlaying && (isRecording ? 'AI đang lắng nghe... Em hãy đọc to và rõ ràng nhé!' : "Nhấn 'Nghe mẫu' hoặc 'Bắt đầu đọc'.")}
           </p>
        </div>
      </div>
    </div>
  );
}

// --- Inlined from components/EvaluationView.tsx ---
const ScoreBar = ({ label, score, colorClass }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className={`font-bold text-lg ${colorClass}`}>{score}/100</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
      <div
        className={`h-4 rounded-full ${colorClass.replace('text-', 'bg-')}`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

const SheetSaveStatusIndicator = ({ status }) => {
    if (status === 'idle') return null;

    if (status === 'saving') {
        return (
            <div className="flex items-center text-gray-600 font-semibold">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>Đang lưu kết quả vào Google Sheet...</span>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex items-center text-green-600 font-semibold">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Đã lưu kết quả thành công!</span>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex items-center text-red-600 font-semibold">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                <span>Lưu kết quả thất bại.</span>
            </div>
        );
    }
    return null;
};

function EvaluationView({ result, studentInfo, passage, onChooseAnotherPassage, onReadAgain, sheetSaveStatus }) {
    const { playAudio, isPlaying } = useAudioPlayer();
    const [loadingWord, setLoadingWord] = useState(null);

    const handlePlayWord = async (word) => {
        if (loadingWord || isPlaying) return; 
        
        setLoadingWord(word);
        try {
            const audioBase64 = await generateSpeech(word);
            await playAudio(audioBase64);
        } catch (error) {
            console.error('Failed to generate speech for word:', error);
        } finally {
            setLoadingWord(null);
        }
    };

    if (!result.docDayDu) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4 text-center">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-yellow-300">
                    <i className="fas fa-book-reader text-5xl text-yellow-500 mb-4"></i>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Em ơi, cố gắng lên nhé!</h1>
                    <p className="text-gray-600 text-lg mb-8">{result.nhanXetChung}</p>
                    <button
                        onClick={onReadAgain}
                        className="bg-blue-600 text-white font-bold py-3 px-8 text-lg rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
                    >
                        Đọc lại bài này
                    </button>
                </div>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 border">
        <header className="text-center border-b pb-6 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Kết quả luyện đọc</h1>
          <p className="text-lg text-gray-600 mt-2">
            Bài: <span className="font-semibold">{passage.title}</span> | Học sinh: <span className="font-semibold">{studentInfo.name}</span> - Lớp: <span className="font-semibold">{studentInfo.studentClass}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Cột điểm số */}
          <div className="md:col-span-2 space-y-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Điểm tổng kết</h2>
              <div className="relative flex items-center justify-center w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-gray-200"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-blue-500"
                          strokeDasharray={`${result.tongDiem}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-5xl font-bold text-blue-700">{result.tongDiem}</span>
              </div>
            <div className="space-y-4 w-full pt-4">
              <ScoreBar label="Độ lưu loát" score={result.doLuuLoat} colorClass="text-blue-500" />
              <ScoreBar label="Phát âm" score={result.phatAm} colorClass="text-green-500" />
              <ScoreBar label="Độ chính xác" score={result.doChinhXac} colorClass="text-purple-500" />
            </div>
          </div>

          {/* Cột nhận xét */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                <i className="fas fa-comment-dots mr-2 text-blue-500"></i>
                Nhận xét của AI
              </h3>
              <p className="text-gray-700 italic text-lg">"{result.nhanXetChung}"</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                <i className="fas fa-star mr-2 text-yellow-500"></i>
                Những điểm em làm tốt
              </h3>
              <ul className="list-disc list-inside space-y-1 text-green-800 font-semibold">
                {result.diemTichCuc.length > 0 ? result.diemTichCuc.map((point, index) => (
                  <li key={index}>{point}</li>
                )) : <li>Hãy cố gắng hơn trong lần đọc tới nhé!</li>}
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                   <i className="fas fa-bullseye mr-2 text-red-500"></i>
                   Những từ cần luyện tập
                </h3>
                {result.tuPhatAmSai.length > 0 ? (
                    <ul className="space-y-3">
                        {result.tuPhatAmSai.map((word, index) => (
                            <li key={index} className="bg-white p-3 rounded-lg flex items-center justify-between shadow-sm border">
                                <p className="font-semibold text-lg text-red-600 line-through">{word.phatAmSai}</p>
                                <i className="fas fa-long-arrow-alt-right text-gray-400 text-2xl mx-2"></i>
                                <div className="flex items-center gap-2">
                                     <p className="font-bold text-lg text-green-600">{word.tu}</p>
                                      <button
                                        onClick={() => handlePlayWord(word.tu)}
                                        disabled={!!loadingWord || isPlaying}
                                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                                        aria-label={`Nghe từ ${word.tu}`}
                                      >
                                        {loadingWord === word.tu ? (
                                          <i className="fas fa-spinner fa-spin"></i>
                                        ) : (
                                          <i className="fas fa-volume-up"></i>
                                        )}
                                      </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center bg-white p-4 rounded-lg border">
                        <i className="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                        <p className="text-green-700 font-semibold">Tuyệt vời! Em không có từ nào phát âm sai!</p>
                    </div>
                )}
            </div>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <SheetSaveStatusIndicator status={sheetSaveStatus} />
           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ml-auto">
              <button
                onClick={onReadAgain}
                className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 text-lg rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-md"
              >
                Đọc lại bài này
              </button>
              <button
                onClick={onChooseAnotherPassage}
                className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 text-lg rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
              >
                Chọn bài đọc khác
              </button>
          </div>
        </footer>
      </div>
    </div>
  );
}


// --- Inlined from App.tsx ---
function App() {
  const [page, setPage] = useState('welcome');
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheetSaveStatus, setSheetSaveStatus] = useState('idle');
  
  const handleStart = (info) => {
    setStudentInfo(info);
    setPage('passage-list');
  };

  const handleSelectPassage = (passage) => {
    setSelectedPassage(passage);
    setPage('reading');
  };

  const handleFinishRecording = async (audio) => {
    if (!selectedPassage || !studentInfo) return;
    setIsLoading(true);
    setError(null);
    setSheetSaveStatus('idle');

    try {
      const result = await evaluateReading(selectedPassage.content, audio.audioBase64, audio.mimeType);
      setEvaluationResult(result);
      setPage('evaluation');
      
      if (result.docDayDu) {
        setSheetSaveStatus('saving');
        try {
          await saveEvaluationToSheet(studentInfo, selectedPassage, result);
          setSheetSaveStatus('success');
        } catch (sheetError) {
          console.error('Sheet saving failed:', sheetError);
          setSheetSaveStatus('error');
        }
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định.');
      }
      setPage('reading'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseAnotherPassage = () => {
    setSelectedPassage(null);
    setEvaluationResult(null);
    setError(null);
    setSheetSaveStatus('idle');
    setPage('passage-list');
  };

  const handleReadSamePassageAgain = () => {
    setEvaluationResult(null);
    setError(null);
    setSheetSaveStatus('idle');
    setPage('reading');
  };

  const handleBackToWelcome = () => {
    setStudentInfo(null);
    setSelectedPassage(null);
    setEvaluationResult(null);
    setError(null);
    setSheetSaveStatus('idle');
    setPage('welcome');
  };
  
  const handleBackToPassageList = () => {
    setSelectedPassage(null);
    setError(null);
    setPage('passage-list');
  }
  
  const renderPage = () => {
    if (isLoading) {
      return <Spinner message="AI đang chấm bài, em chờ một lát nhé..." />;
    }

    switch (page) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'passage-list':
        if (studentInfo) {
          return <PassageList studentInfo={studentInfo} onSelectPassage={handleSelectPassage} onBackToWelcome={handleBackToWelcome} />;
        }
        return <WelcomeScreen onStart={handleStart} />;
      case 'reading':
        if (selectedPassage) {
          return <ReadingView passage={selectedPassage} onBack={handleBackToPassageList} onFinishRecording={handleFinishRecording} />;
        }
        return <WelcomeScreen onStart={handleStart} />; // Fallback
      case 'evaluation':
        if (evaluationResult && studentInfo && selectedPassage) {
          return <EvaluationView result={evaluationResult} studentInfo={studentInfo} passage={selectedPassage} onChooseAnotherPassage={handleChooseAnotherPassage} onReadAgain={handleReadSamePassageAgain} sheetSaveStatus={sheetSaveStatus} />;
        }
        return <WelcomeScreen onStart={handleStart} />; // Fallback
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return <div className="antialiased">{renderPage()}</div>;
}


// --- Inlined from index.tsx (Entry point) ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// --- END OF INLINED SCRIPT ------ START OF FILE types.ts ------ START OF FILE constants.ts ------ START OF FILE services/geminiService.ts ------ START OF FILE hooks/useAudioRecorder.ts ------ START OF FILE components/WelcomeScreen.tsx ------ START OF FILE components/PassageList.tsx ------ START OF FILE components/ReadingView.tsx ------ START OF FILE components/EvaluationView.tsx ------ START OF FILE components/Spinner.tsx ------ START OF FILE App.tsx ------ START OF FILE services/sheetService.ts ------ START OF FILE hooks/useAudioPlayer.ts ---