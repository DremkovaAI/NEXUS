
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const el={landing:$('#landing'),portal:$('#portal'),workspace:$('#workspace'),dialog:$('#login-dialog'),login:$('#login-form'),error:$('#login-error'),announce:$('#announce'),mobileSheet:$('#mobile-sheet')};
const labels={teachers:'Связь с преподавателями',events:'Мероприятия',journal:'Электронный журнал',support:'Техническая поддержка',portfolio:'Портфолио',overview:'Обзор',actions:'Мои задачи',schedule:'Расписание',grades:'Успеваемость',requests:'Обращения',notifications:'Уведомления',profile:'Профиль'};
const days=['','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const shorts=['','ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
const kinds={general:'Обращение',certificate:'Запрос справки'};
const escaping={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>escaping[char]);
const zone='Asia/Vladivostok';
const datetime=new Intl.DateTimeFormat('ru-RU',{timeZone:zone,day:'numeric',month:'long',year:'numeric'});
const shortdate=new Intl.DateTimeFormat('ru-RU',{timeZone:zone,day:'numeric',month:'short'});
const weekDay=new Intl.DateTimeFormat('en-US',{timeZone:zone,weekday:'short'});
const schoolToday=()=>6;
const schoolDate=()=>'2026-11-21';
let data=null,period='day',day=schoolToday(),compose=null,opening=false;
const routeName=()=>location.hash.slice(1).split('/')[0];
const route=()=>canVisit(routeName())?routeName():'overview';
const date=value=>datetime.format(new Date(value.length===10?`${value}T12:00:00+10:00`:value));
const shortDate=value=>shortdate.format(new Date(value.length===10?`${value}T12:00:00+10:00`:value));
const notice=text=>{el.announce.textContent='';requestAnimationFrame(()=>el.announce.textContent=text);};
const state=(message,type='')=>`<p class="flash ${type}" role="status">${esc(message)}</p>`;

const envelopes = {"teacher@nexus.demo":{"iv":"MC9tCQlO0TAMY95L","salt":"llORdfuOkGxNsjjkfZuMZQ==","ciphertext":"EDwi9SOaqDKM/auFrR9FuzTadoq0fZxlfoLxEIeYCaMVQ3HE3gLTlX4mmhnKmylMMCXdYCpmWYZ8nvJHrKqQeVtCKmX0yGbchO6IaCEqO4ffEVr1MxqfgXczhAK6v+l+BH+ltP/LLxADjwNAlSvy22OiJBhLqUNEjKvLhZHojQnAqlrMuKjqCuumXGeyOGl7dIrq2MYtxUBq478e/LWkKnaCP8DEOZnW4ShukKw4q3B7/NAId51eZHASlMkJlp/kYzJFn1YSm2VxsqDxEF6/Mluou3NowkAWoL5V++xeJS32OosD7TvHtneREExqer1fy3dd1R9sXM5Q7s2WwbPqiGoSvPAv5R8dYxXV5DybuplqBSFCGvb6oy3TCtP5yQma5IdV3crMe0UwEo+f0+rPq430tma45xJaG/xYEeSbm0QMah7lyz43Y1KVm4TUwPss2XULEH20LVBAMvaxTj/7+jFNQIzFpOMHrQ+l4btuqipyQ0IPwbFe8xunm0inCPgwgDgJVhrjCHjDrzHUNUYFNGNIwZOvxxdlRglm59AHX+JZ0rifN5nnszM03K67iNRwT8TJv5Si+heElK2KFkvg8450negxGPaRQWs1EUDYf6b26+jOUYYOoxwNLS/YMjhGNowl5vRVuj5rUcESGrKS48Y4STG6OeDonlGooOztBlUneA9brXtx1ATSafsoCYUjctbTEIWR4tMZb+Hp7bqlUFmX2qp63UXVBEBwMvxhDwnkciUp+jLas/TEk43ZP177Y7zwKFQHuyk3Q3scYIYJGdF08Pp+OItNsnz+DbmpLD9Queh9K8IHYfsHW5e1fkw8eD/vJDqbWE5ys6ETiJImR/Ab3vX2D+mOPMVjfAuJv3reckab83AXLwnrJud0XWlFv6fdShvqCvFuzzzh6gO8iHNDb/1ZKhZ0kHyDfXTSpcFte4YF0LYEzHFFUFJpb5yV+5siXqF6V0fLP+3RJrn5GTDttdcG+bilaG4TSvutZZL8ezUk7PJqmd8OeHwhtajUzh/ebYljmWgJmDkZ"},"anna@nexus.demo": {"salt": "mj1jWC+7Wx2T4T/aIzoufw==", "iv": "rvn78UBwsJNUa87k", "ciphertext": "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"}, "max@nexus.demo": {"salt": "H94j1X95g2weZPVRH5PsGA==", "iv": "44iKY9ZBOaCy6Yq4", "ciphertext": "w3DQubKTPOI1sFTD36qWGgh6bcGfb0mKIOaD9xySsP5zdIhZzkOPi93YipPfWj/ylfzoS70XIS6ZMAV2pPfnKqbsMprAjamngCYnlhJCy8edeuTtW2qgbZz/OzbdV1u41VVPUxuZDim7EaTpygf8nkkYBhKLIo2OutTnsJgA00TqO1nOVJZ86NF2P8lGdAdOqcGDEno9wSZEipL9xevJYVNS6bc+/C+CMhOucF73telPamV3lh9DGgu2//EU4l5dCZKAwnQi+SbikmRqsBqGTJFfmM6tb+O8p8Ptfk240VpRpJaO5q5/Ai4sM0oGgLOM3FcfNafDgwdhPvUdGfA61vBt+WOe+pjpe7uuSb4x1h07rHvf+6PSBY4TG0c3J8ewBnj8Vht9Eq9D2jQRrA/aWi2HU1MyXOmA9Acirh22pBN6hBcMzh6myHgr76pEbF5Gf9/dkLffSK7DkSUExPDpN/gX9Mj/HGTwTroSPUGaIICnwoeXDvqjwSwEClkynQIsG7OVrocxMdp29TAdHWzyDZqi3IUWrebjBWjiF0PwvWQHpJwV6CxERIWWgqMnH1Bt2U2FcZB4OuLV4ZIwRbqO16dn79cx2ZLGnIB7eLx5PuMyxK6C/CJ/syltMJ0oM/XNN3YqGymEYgFDQwFsK7g+ie1Xg2hmuhhaDifCrzjNrflRHons+VTwHG5V44rRaXPutekeHQLijADG9/hItUiFqXz/dssyUKGkMY/TyHNYk6CsYFH1tKXsUV+SQeO7D3dnhGJQqm05vTihPLzRbhtKOggp8Z7PNvNbgCAzum5J9/rdr+jiAYD5eLixcIMK54P0LKh4VVtDk3bff6ZYdkkCoucBMCC+Ys+tgBWzto7F2oEQifw4faGhmgoJAc8f/0GmRGGjyetwljZTrL4h8kDt5cwL3436RuaoJY/wC0KspRpDjy7A2x2anVBvRy+zOR6dWlVNRSDtd9qIeKsKzRnS0opLVXPEH7oWf8trg/GhL31pDkWodxIfv8CrEQsFHhO//qdPF+ICndzapSUjNQ4kFz9pmo1TQFybz2+hX66k959dGgklMNX2p8YVpTweCTIjGqhUgoXS5xbpsrQhVyVosz7LygtBAu0ZN1qY8G8TDlXaTyzu+KcBg1EIliQIOmwkQzxtx1jhZvtH4gssIa0/tCWQODm8K/zvfuEf7ftbGRHZPtTpRDTkKdBrXbtveJF7TSTdtHQPDHNZO/12H1KAGCYNz1pSzgzdcVFilVX1JmBv6SXnFCZKnmRfe9/9QaiQ0UJF3VX9JHQRKCKfh/RNWUBzbV9XqMDICz3S6+GqvXZj1GcBB0c+oqe4ElkU4ghRHxjq3rFs/VcYHLRJVD06UVGwSqlsO5sk1eZ1Qm9VXYrjxGhL/KEYMPVPx/8Dhr0SE2g3MPGbOyvoDC2ABC0V67PH/ZTLtYscWQfvDBs2nC4vOzXcrQhvaTKomv1GCX1+ofdZMn86+W+8xKrESWBrdKbTeC+xNjcZNxp5JbgHTYHATK0EeH6f88mhN/6FhsGjSf9i41Gad6qEcvzL24uGQ0woaLqjRxDJz75X3Gc+12HzaJn8/7QbaSSPTtjlD+vEMs+Ae8zcsMJqN9pWdAGwQp0yKWteOG2QNSUl6AvQ2PUCP+Jvc6B6xJxrRi7VvPfBGm0uON8toFzKXCEy7fXfd74xSp0Ue7mu06FONYm2YiW/49HPELBj0Wx9gOdXxcvV8Scw9HJaWWhKVCJj5WTS1stxs1dwrK/9B0geJHsQG0tXKGDtI3WetNo0Zo/hsN527mv7jCgX2rHYOYQpUX363pDCaWI5iA+z56NF3h9b53JG/boRyf+HnNYB905c0KNXz+CXaOxaClrmFdAtrG5IyTEF2MADlXDOW0OFIxntjIa+/2wxE2v+0y07I1+FTdWLWk3pcf2Tzvyb0iFOTRXzoTHo6mOFyudCgMPKeF8559yyGtwNrEyjuOtiEr0AUBVtjhpOiPkkpfJsIMjb/sqFDkVSqKxMcgk+veUNrYMCt1tJS92mq467wdt9sN2125l8nwfrJcUx/l3SENENA00VYfN0TVs4p2MDa2+BfqqwGtydyNj0j8ur1D71YE3vCWZ3tOR5Eb3k10jIsfPXKfM7xTzcA5vZJKNJu/d7k+t9VETFNxpVSWku3KG7V+mw7dg/+kMgomzoz17i9QJHbPsNgkIZs9ZUp8rqi3lon8G+LLZYFLiu95I8iMwE2hrTX6kG5iPb4sHxWF1ORJfC3z7IcmggLK9PAAcYfBFL+z0FAD0vytfm4w57bPzEr/TDKK4gXNrrv5GoJi4CVoZG0RYxsFcGhQRM+L1Ji+atVoUQQGzaTD/zdQhE/BFjw3/1JkFXH27Nb8pDyuvnYlKrzpJElLZHaEq488RmLM5C1b3p6ZR/FEMO/yKXvk00hkAGl2AZVgIH4xK6kGQFx5W6c0Ss7AOWWVOdVAUCUYtQxBH2e640uMLfn1/PCASAnnu+Lgrqc6VATvlEzEg6V+fgq1bMT82n40nyAlPPvh8RG/Q0CAoaNa+ruP/qAeLZrBUGd/FIH7mVeLhuKmlI0OuU+A8aiGU8NzMPGUjn0nMtnVKcgdoUb8v34nLoabImWO8ZDN5KxfCZjxVkM1siVMA9AQ2I/M3khkppTanYJ3MlCX0NSVkM7MnNDVJ/0e4pb47WYE5P2WAqmay3nTegP14fTNws2IR006qv3BjkbyguZPDlLzzWZxpiPlUjDTl3nHRsXhWhNYbHvLRT1HM/KYOkEwvBFS1iR28Ckid8TrBxNqd06Hdoerm9B6ZhFHcjvnTWkrxK3vgB3HA4u7GtpH3Uwv3HePO8iHMdXqoSjLTwDqEzX7yj+RX0EKFRmf98IEXvrNYdFHJfr1vB4uTM+YhSvRdF2/7nugOXeN5r7nkab96+PT96T0rQ+zig3V1nW4dZ7PnzrY4DQVCsx2NtxV66dkPVx5XgZYNF8oLxaXI95LnPRLbIOfy/Imp7kyCnVr5vKRwRg9Ag+wFi9QFjBWC/y9iYf/hFJh2LNSadGQC5C414ZKu4/qSBGj5751L8p1161FdMAOrElLTlDF785SgYF1Zrf2Xbc9knINbogCJ+6rmTdbqXzm1rA2+pFeFDHMD0brf27zhOcE5og0FTYeVflyQMPDlb857Yj6FEUygfTTglySvOc3z28ynHsCO8QfjvHLqprj046vI6MF1N5VBWTuY1loLXahxDrFuVLeh2RQiA+RhHbr+svIEfoKwuo2s/Mzc5aKQ4/TQ9WEs7MXUcgCROd66oxzXCb9FV5rPvkBNqOEtWkII2Qlzl2xq7ANtoq3oVzV3tcZZu4bgEq2uXGkTsnhK88BqqfbXbQDtRsCXjr5qbDnAZVdKFuxkQtBPfmUVFVMvJlgBy88nfkk3DnI6dc1AJs6CfeFj8LWJga6AL5ZNALhW0ajQt42sL4JFKS2YlRo3ZNfRzWMfQcqChYh7vs3jOLSoBCG8+XLofUS2vAR+C9LEihxUiJlFXVhHEIpYbQvtIzYg/Cpknr7l2Du3P9OgNXeSq1Wmjsyv2a1Ff6tNUg4aguPugp7dowmRm88YLwbDzEISUd8UURqK5/VlOQKgFDUs/Ycs3QR4O9XfqiqHLXKon77EUXLln12iDKRXKy/Eanu02BACVgjJqwJBWhLI8vWEfcDs4QXstXgwbAhBLEnhb4qv4IoF/8EF+pLZ9BTFbE6t9zNYpyNapatGOQMEr6o8TlnbMf8CbwjpmLphnUbv2De/1rXnm+Tu+X3xe7ioC3VPseXwFyu1FxAN5h7cjHJ29+zzd3MFeP81R2Ak71Fq3mTMPD/GUJI4cMmV2/EFzvpgUM5ZnnzTZkWGE61Z2r4YBJB21QCVyqb9AT+reS1dK9eiw8I/MX17QtSi5pcoMEmMLEEk0QrGBk3koZEAeB7cTVRZtgvwELxlT9WpFc25zdmXTtuKcSlyVmhH0LfmVUBg9iJh04Ju+0bVcFb+tXRNIB5C+QM9Qo4DyAf9XwV4UnskU5YtqsLlYNe21A0cEeCaZAmWSMRDQRCRFHHtcpeliL0qUk+pyTR2uB2DSMC8880vy78PlNOyI+AhGLvHONvd8U59d5zYIEASOVSe1bcPLSEal3qefdiACSpuTQeW1LOX1ldZ0Xl3bXoQKkIWGRxdbKbSsUFEeqXL0N73/2pmi1Jkm7p8+DDzFu4PUQBwGiEvcqUgIItyFyczlJmO4ErdOW+39OAlLUWHPw3G/9IrSFA8dLduyLtToJdVkb68j4f9xvj8mwlMcFpbfoDAOJIngQiu91VRFVqQOAnCCf6HkToLl6tkSnto6T7KB2UFCy0/Lt9DYYkWdDji0Y986DU4gI0f94KuISBkOvnbf9E8R7j5wuC04aKVuzNugsjmuFYOD9jGmurycUe2oWpKLu/I4Bc46N3Us3e4qe2cvC6WR+zy+dH2jQXHw2WHjvX8JaOuuXoP70GvX21el5y9mIZ+dujaoMhiwUWhS/tWViyDG/cC2GGgTkWuWPHSxWqkYejLEPBRuTQtC4KlSv0upcpOJ8lQIOxDDBhL+9d1IOq6OY2lcRH4GL0ev/WT1D1ayqWJtS4X6DyhWOC2OcfPGyjljZTO09Ykhl26kqiAAwaE3kpjAZIwIYMSDrW6apsLSYYE/XZwimSUxG7Lnu+vkXD5iZjzFUTHMDXGKCsJPwUYXcNOjIE8uAQu6Lk68crrZ0M2m/It0+oOBB6XTb3mDeCW/LDluSMa5rpMy0/Z0gjLmbwfNCZkJRzVcKYm3K7zhcCOAh5gVZQTV+oVcDiVap9T6PgJdEvWcOvHWirjwE2zBFePX60gsRGA4YVJQsBuH0qaHBDBg6/SpPPA3mQW70G89UaqZR9cgzypUWpjDGvTN8MrJOgB4et6tKWpXpMCKQmRl8ew63T7YZnDj3bw54d2x2YRVyuQC9gDDdpB+rfmvwzMXZEolaq3IdgbhVgDvUonoLUdhruOjW7mt66G9LCEt/m3x6PBGiZwmPSjfD+F0eMc1dDju0kjVc84eUx5goBC1lSSzTFR1t9IaI2W+bHHRXUR6/HKnh/qdVVBSu0ic8WgFI/kkt63AlEZmAkMBjLAKBSdahAcZzdP0yDcTDlWyNA/xTIqiQTsFVSThsvplq/dUvLxajDnpZBVmhZq4IJJzmQQmbRGj+3pSyr5ezOhBWYC2k6LjINvqVQkdMm10sEgNyEDupggus4P+D1ibl6kZSqyXMlVj3Lo9wU9XN9D5U2+QurtHckq/8mZLxSWOdtUSHJgJJ+vK6xcFI0m/feh6LR7z35WLCM5/5AmtaSEZn9Fbf4zPx4Ax/x2KKOZbvpImcWb4RwMho71kJhrGYZrKTdiWJ6E7KNIqTx1HhWWxWEE3jcvDZpfGxBe1N8tdyIDSHp4djAp5PZi7wFAf6LmbkH106FncqJlnOVljB+MeepjFtTgwvDNAS9ZVqFwAoKU8Aib8PoVunbow4h4ckIOGcxtgd0r+IiwoKEdiNMO9jdrapT0pqKl9IVF2YL9Rq8lFJiO4RBYzd/i3oJiY//4z6yFXIEI4O+6OzvJ9AlJOtxpj8AgaI8ydps0HzSLchlritFA5jL4SvqeMcvuYc8JHkBV2pHuB2j7xg3f43/QDXlMZq6zQdFhLeTYAHezHmE/S4QiTHiaDkm1a8MG78i9yh93TZD3CfK/fVdjbQt7VZ2Q3w4UnWCEyTTH14KAKHMNmYYADczil3QcbMMowqSEmEzQSlfG2PVgiBFhxKVHERcFJF4e2bgZx9ZN+puwIdcpfGmBmhfV4jiz1CVhX1NGAjk0wmWy4hA0fo8L1ju8hpUn/wJiUDOWKqv5HxJOvyCTsV5H2IvE0TNfOhCYi65LT/EC/EWt0wPstt4+A4HdCAU4pDliXFSqDn0/Uwe1U3cp9FCYtzxJJL3qYnM23MzAAqDaSd7Rpavp4qfLakLOA6PlmjEoud0qWNi/SjYH7csTAr+rXd0YMrXghwDXhRPiC9eCImpg76ZEYdNSPV6A3H0h+9i7+Y1vd5efzBaCbrLLoRm/DZrGYPBCV1wxwYFtOyu3YR7bDqm5wFaCETQ+LWYQBZ1zjZam8P5hRrnaVXpjdJrlFT7/Isruzz0ESB60KwkxBrrlT/4zrIKPBOzuD5C5rD8obyf0aFa4EWriVjz3RItzmO95dEwsBJ9z8rsa93rzrl1WYjbmI4S1VxXwMvBJkJ7s6BgTMpxQnSUvodxI3GGw2sex0DKpyMCAAsmfzGvYlc01Dg27HJola5sMzASfdNurKDn7RB24QLxCaWjFiX4tXP4zZCA4IozdlQBYDh8toTa9KuR4ICsPTax+0rNjbTDDh5MzBCWqenUnBfNZdwUUtbWBCpql8DzGbFLhOB4+cr+oYdlDqvMBtfcybSfkkinPlURa838EoRTOPg/qyqE0fo0eO+3v5+FzpbBUTcd+6PYBjsnQ/BE86tycOlcP2HJAvwNnPDlrtN0qNq34jqNvkFbsNf8D/zvVuXZqXTEA/Sr18pF1IDTO3e+UFUi7ng8DJ5MTyp94Qu56kJgQA6dyjeWg1QtqQebLn5+ykOn11Dq5mRewiW+ecRF8rjtK8Fk2nODVX4radgFQBKQs7jamxpaEQlYPD8jqUWfRoMCDLgoWb4SHAs1cXBxzkBunl0KlcVt0BBDNNONw07aBmMdEKMSKw0TF+e7xngl7uegJKgW8bnj+pOq63l+PxYIQ3asN8oScmfo6ydC3eDnP6CLDoI7u8SzwUz2lFbkwGcD0RdEQa5ENbxuDa58qisgsbn+a107qf9+gJkw/LF8NPatVQd/bKFWlDbKjp9lbEJd+sje3uvRMQrhOWR9QjYo7/XNwwrk/mn+Py2RaKSgq9KukqwWoNb9QDNZ/75cYZzE6qC3+ohDYVixqn2sEEuOtKtj/QPKy/euz5WgzeDiDpe9KXcYeWeFhLKERiE/84DAjY8QryTX1WatLNSnAHBN10C+pvrG8L+K9ViG33+/SiVz8REfwfMcN7ltl3nYZPcXfnNvEU0NS1Cp3wUfdRE9QM/+tSzlDfwkytLLLDTnQO6ZrkR4r27SlmH+RUlhvn3rkEuN6eKPdX1+FHqBkxuLZj+BdYQWFNJuFTbjDeBA7hmYYFYprjpmbaP6eo0yMkB+R+PiY6NcrsOXHEJpU8vhyqu+J/gOtulRftWytnZoyJ62wAFabxZ+PyvDQGAgSnh/QHbSJaDnVHUvdovT+BwKEZYCkeZQnBxu/2KnfL5J4GPVgLo7aEihPZAuD6iaOqTCtWQFOq3RRohnr6riF6f1ERaGTfcTCg7kFSuTxpJ5W3STH2vTzAmHn0bVg2qpKf3D7vmu/C40NdVzvICsYEQaJ4R0dwqOWTR3GVqEcxfndJ6VD8PxU65hoIMpgXKYnhZ3nWrStue9GZTP3Oym5MasuC1+HGwh0mrTD84h8SPjM/HZjQvoZpAjhAU7H2fGjC5LGWb2F9XBGIBjlQx0xOqcG2hDNNpgiSiqFWTRvUDlRBL3KmJwCNpDI5qegyTMLTOaWWP9+9nRPWcQjtdh5K2TxGkKgevVeW3uTxQheUJntO/OxkeC0VBp7EA49hdQY8BvBH+FWyKThtnzY0w1CAMw1mIvjDjkaUVV/ac8EYaMmqcC+zYf8cp9bKJh/n+1hi6Etg+1VJo3vzfJ/buwtn7yvRMRnigPBx+F2JJo7iWaw+cmQsHnJyaPHLaVOryBUc0hgvG7wH1VviSifoUbpR/Rr6ev/2hc5D3BlsLBvUbAZDtrkblm1Jl3Cj0dN0piuKV2WtP1ZSuwo2x/vcJIc979vqsmn5bQswlLYs15NW5AX5m9EmHVT/yizZ9QsdpmZ8VutDsN8CCFM1Gr/0Lg6fwSyo7G4UsXY1ujuWqUvRB+/txFIlMxPDXRMblN3g7HUNvu4uR+5oF12mLC0r5T4FiqLMdRu94kwIkcPKI0gbx74NkxC8tC+gu6mBZtn1sp7AaN95TerQj+p8KZ//uJTBY/IScUYqhvfYkwoi9F1qeQ3kYfFbxAC6mHWR+82ECEC5RMQyXL+Vft4DH3IPbvJwewlMmzRUT5DFH5saUDibkCfNpFnrZzNcNYwri6oynBM2CeHLdRz2uKqqp2nyeaobN9STZbFVtlP3iyH+KB41dOlhrd0x/xQcuFX3bH+RoXFuo6ugFuZ2GrY3UGeykT+g9Zu1PaM61HpflsR5FNymO946bERrly76iJC0r8DxdY5t3xHA2m2Q6l+ADVhTxOx24MvyP2/cHBPbAga/6WyZGI2ljaOPmemtYzyndEyAiMxxyqeXT94zjYJEuCisO7qhYDAPH6tahqLvl0b1AFMOxS0Bbd3Sb/zpGiKKtnPbB8o7K6ERCgr9moBC24FbJKpX4zKlgX/XxUPZJLQMjWsRpTDMxSOj1I2R2zKVzTpnmM/K6Hu32DtawGmkuuL+8VIww8z5OGAgxT8V"}};
const encoder = new TextEncoder(), decoder = new TextDecoder();
function bytes(text){
 const decoded=atob(text),result=new Uint8Array(decoded.length);
 for(let i=0;i<result.length;i++)result[i]=decoded.charCodeAt(i);
 return result;
}
let session = null;
let database = null;

let storageMode = 'database';
const volatile = new Map();
const localPrefix = 'nexus.html.students.v1.';
function chooseFallback() {
 try {
  const probe = localPrefix+'probe'; localStorage.setItem(probe,'1'); localStorage.removeItem(probe);
  storageMode = 'local';
 } catch {storageMode='temporary'}
 return null;
}
function localSnapshot(id) {
 const raw=localStorage.getItem(localPrefix+id);
 if(!raw)return undefined;
 const record=JSON.parse(raw);
 return {...record,iv:bytes(record.iv),ciphertext:bytes(record.ciphertext)};
}
function pack(array) {
 const raw=new Uint8Array(array),parts=[];
 for(let start=0;start<raw.length;start+=16384)parts.push(String.fromCharCode(...raw.subarray(start,start+16384)));
 return btoa(parts.join(''));
}
function openDatabase() {
 if (!database) database = new Promise((resolve, reject) => {
  const request = indexedDB.open('nexus.student.offline.v1', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('accounts');
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(new Error('Браузер запретил локальное сохранение. Откройте файл в обычной вкладке браузера.'));
 }).catch(chooseFallback);
 return database;
}
async function readRecord(id) {
 const db = await openDatabase();
 if(storageMode==='local')return localSnapshot(id);
 if(storageMode==='temporary')return volatile.get(id);
 return new Promise((resolve,reject) => {
  const store=db.transaction('accounts','readwrite').objectStore('accounts');
  const read=store.get(id);
  read.onsuccess = () => {
   if(read.result){resolve(read.result);return}
   let legacy;
   try{legacy=localSnapshot(id)}catch(error){if(error.name!=='SecurityError'){reject(error);return}}
   if(!legacy){resolve(undefined);return}
   const copy=store.put(legacy,id);
   copy.onerror=()=>reject(new Error('Не удалось перенести сохранённые данные.'));
   store.transaction.oncomplete=()=>resolve(legacy);
   store.transaction.onabort=()=>reject(new Error('Не удалось перенести сохранённые данные.'));
  };
  read.onerror = () => reject(new Error('Не удалось прочитать сохранённые изменения.'));
 });
}
async function unlock(secret, iv, ciphertext) {
 const clear = await crypto.subtle.decrypt({name:'AES-GCM',iv},secret,ciphertext);
 return JSON.parse(decoder.decode(clear));
}
async function getSnapshot(active) {
 const stored = await readRecord(active.id);
 if (stored) return {revision:stored.revision, dashboard:await unlock(active.key,stored.iv,stored.ciphertext)};
 return {revision:0,dashboard:structuredClone(active.seed)};
}
async function commit(active, revision, dashboard) {
 const iv = crypto.getRandomValues(new Uint8Array(12));
 const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv},active.key,encoder.encode(JSON.stringify(dashboard)));
 const db = await openDatabase();
 if(storageMode!=='database'){
  const apply = () => {
   const current=storageMode==='local'?localSnapshot(active.id):volatile.get(active.id);
   if(active!==session || (current?.revision||0)!==revision)return false;
   if(storageMode==='temporary')volatile.set(active.id,{revision:revision+1,iv,ciphertext});
   else try{localStorage.setItem(localPrefix+active.id,JSON.stringify({revision:revision+1,iv:pack(iv),ciphertext:pack(ciphertext)}))}
   catch{throw new Error('Не удалось сохранить изменения. Проверьте свободное место в браузере.')}
   return true;
  };
  return navigator.locks ? navigator.locks.request(localPrefix+active.id,apply) : apply();
 }
 return new Promise((resolve,reject) => {
  const tx = db.transaction('accounts','readwrite'), store = tx.objectStore('accounts');
  const request = store.get(active.id);
  let conflict = false;
  request.onsuccess = () => {
   if (session !== active || (request.result?.revision || 0) !== revision) {conflict=true; return}
   store.put({revision:revision+1,iv,ciphertext},active.id);
  };
  tx.oncomplete = () => {
   if(!conflict && dashboard.actions.some(a=>a.user_created)){
    // Keep the localStorage fallback in the same encrypted, per-account v1 format.
    try{
     const previous=localSnapshot(active.id);
     if(!previous || previous.revision<=revision)localStorage.setItem(localPrefix+active.id,JSON.stringify({revision:revision+1,iv:pack(iv),ciphertext:pack(ciphertext)}));
    }catch{/* IndexedDB has already committed even when localStorage is unavailable. */}
   }
   resolve(!conflict);
  };
  tx.onabort = () => reject(new Error('Браузер не смог сохранить изменения. Проверьте свободное место и повторите.'));
 });
}
const facultyPages=['overview','actions','schedule','journal','teachers','support','profile'];
function teaching(){return session?.seed.user.role==='teacher';}
function canVisit(page){return Object.hasOwn(labels,page)&&(!teaching()||facultyPages.includes(page));}
function pageLabel(page){return teaching()&&page==='teachers'?'Связь со студентами':labels[page];}
function teachingLessons(user){
 const raw=directory.flatMap(d=>scheduleFor(d).filter(l=>l.teacher===user.registerName)
  .map(l=>({...l,group:d.user.group,student:d.user.id})));
 // Deduplicate by group + weekday + begins + subject so one pair appears once
 const seen=new Map();
 for(const l of raw){
  const key=`${l.group}|${l.weekday}|${l.begins}|${l.subject}`;
  if(!seen.has(key))seen.set(key,l);
 }
 return [...seen.values()].sort((a,b)=>a.weekday-b.weekday||a.begins.localeCompare(b.begins));
}
function scopedRecords(records,active){
 const user=active.seed.user;
 if(user.role!=='teacher')return records.filter(r=>r.owner===user.id);
 const lessons=teachingLessons(user);
 return records.filter(r=>{
  if(r.kind==='teacher-message')return r.teacher===user.registerName&&facultyPeople(lessons).some(d=>d.user.id===r.owner);
  if(r.kind==='journal')return lessons.some(l=>l.group===rosterUser(r.owner)?.group&&r.teacher===user.registerName&&r.subject===l.subject&&r.date===lessonDate(l.weekday)&&r.begins===l.begins);
  return r.owner===user.id;
 });
}
function facultyDashboard(d,rows){
 const lessons=teachingLessons(d.user),today=lessons.filter(l=>l.weekday===schoolToday());
 const reminders=today.map(l=>({id:'fill-'+l.id,title:'Заполнить журнал · '+l.group,
  reason:l.subject+' · '+l.begins+'–'+l.ends,lesson:l.id,
  deadline:schoolDate(),action_type:'journal',importance:'high',
  state:groupRoster(l.group).every(d=>rows.some(r=>r.kind==='journal'&&r.owner===d.user.id&&r.date===lessonDate(l.weekday)&&r.begins===l.begins&&r.subject===l.subject))?'done':'open'}));
 return {...d,lessons,actions:[...reminders,...d.actions]};
}
const publicCards=[...document.querySelectorAll('#features [data-entry]')].map(link=>({
 link,page:link.dataset.entry,title:link.querySelector('h3').textContent,description:link.querySelector('p').textContent
}));
function configureLanding(teacher){
 const substitutions={grades:['journal','Посещаемость и оценки за занятия ваших групп.'],requests:['teachers','Вопросы студентов и ответы по вашим дисциплинам.'],actions:['actions','Подготовка к занятиям, проверка работ и заполнение журнала.'],schedule:['schedule','Время занятий, группы и аудитории.']};
 for(const card of publicCards){
  const [page,description]=teacher?substitutions[card.page]:[card.page,card.description];
  card.link.dataset.entry=page;card.link.href='#'+page;
  card.link.querySelector('h3').textContent=teacher?pageLabel(page):card.title;
  card.link.querySelector('p').textContent=description;
  card.link.querySelector('.section-art').className='section-art art-'+page;
 }
}
function configureMenu(){
 const isTeacher=teaching(),primary=isTeacher?'journal':'requests';
 configureLanding(isTeacher);
 const slot=$('.mobile-tabs a:nth-of-type(4)');slot.href='#'+primary;slot.dataset.page=primary;
 slot.innerHTML='<span class="section-art art-'+primary+'" aria-hidden="true"></span>'+labels[primary];
 for(const link of $$('.side-nav a,#mobile-sheet a')){
  const page=link.hash.slice(1);
  link.hidden=!canVisit(page)||(isTeacher&&page==='journal'&&link.closest('#mobile-sheet')!==null);
  if(page==='teachers')link.lastChild.textContent=pageLabel(page);
 }
 $('.sidebar-top p').textContent=isTeacher?'КАБИНЕТ ПРЕПОДАВАТЕЛЯ':'КАБИНЕТ СТУДЕНТА';
 $('.top-bell').hidden=isTeacher;
}
const teachingTypes={
 preparation:{name:'Подготовиться к занятию',description:'Укажите, какие материалы нужно подготовить для группы.',field:'Название задачи',example:'Подготовить упражнения для ЛГ-201'},
 review:{name:'Проверить работы',description:'Укажите группу и работы, которые нужно проверить.',field:'Название задачи',example:'Проверить письменные переводы ЛГ-201'},
 personal:{name:'Своя рабочая задача',description:'Добавьте задачу в свой преподавательский план.',field:'Название задачи',example:'Подготовить консультацию'}
};
function facultyCTA(a){
 if(!a||a.state!=='open')return '';
 return a.action_type==='journal'?itemLink('journal',a.lesson,'Открыть журнал','btn btn-primary'):actionCTA(a);
}
function facultyTask(a){
 return `<article class="action-card" tabindex="-1" id="actions-${esc(a.id)}"><div class="action-card-top"><span class="label-chip">${a.state==='open'?'К выполнению':'Выполнено'}</span><span class="action-due">${a.deadline?'До '+shortDate(a.deadline):'Без срока'}</span></div><h3>${esc(a.title)}</h3><p class="action-reason">${esc(a.reason)}</p><div class="action-buttons">${facultyCTA(a)}</div></article>`;
}
function facultyTasks(){
 const done=data.actions.filter(a=>a.state==='done');
 return `<header class="page-heading task-heading"><h1><span class="section-art art-actions" aria-hidden="true"></span>Мои задачи</h1><button class="btn btn-primary" data-add-action>Добавить задачу</button></header><div class="action-list">${activeActions().map(facultyTask).join('')||empty('Все рабочие задачи выполнены.')}</div>${done.length?'<section class="stack"><h2>Выполнено</h2>'+done.map(facultyTask).join('')+'</section>':''}`;
}
function facultyOverview(){
 const next=activeActions()[0],today=data.lessons.filter(l=>l.weekday===schoolToday());
 return `<section class="welcome"><span class="banner-photo" aria-hidden="true"><img alt="" src="${$('#campus-photo').src}"></span><p class="eyebrow">Кабинет преподавателя · ${date(schoolDate())}</p><h1><span class="section-art art-overview" aria-hidden="true"></span>Здравствуйте, ${esc(data.user.greeting)}!</h1><p>${esc(data.user.department)}</p></section>
 <section class="card priority faculty-home"><div class="card-header"><h2>Следующая задача</h2><a href="#actions" class="section-link">Все задачи →</a></div>${next?facultyTask(next):empty('На сегодня всё выполнено.')}</section>
 <section class="card"><div class="card-header"><h2>Сегодня</h2><a href="#schedule" class="section-link">Расписание →</a></div>${today.map(l=>lecture(l)).join('')||empty('На сегодня пар нет.')}</section>`;
}
function facultyProfile(){
 const u=data.user,fields=[
 ['ФИО',u.full_name],['Должность','Преподаватель'],
 ['Кафедра',u.department],['Группы',[...new Set(data.lessons.map(l=>l.group))].join(', ')],
 ['Электронная почта',u.email],['Доступ','Преподавательский демоаккаунт']
 ];
 return header('Профиль','Данные вашего учебного аккаунта. Здесь используются только вымышленные сведения.')+
 `<section class="card faculty-profile"><div class="card-header"><h2>Информация о преподавателе</h2><span class="label-chip grey">Демоаккаунт</span></div><div class="profile-grid">${fields.map(([key,value])=>`<div class="profile-item"><small>${esc(key)}</small><strong>${esc(value)}</strong></div>`).join('')}</div><div class="profile-note">Конкурсная концепция NEXUS. Не привязана к реальному вузу, не хранит настоящие оценки и не предоставляет официальные справки.</div></section>`;
}

function journalLesson(){
 return data.lessons.find(l=>l.id===svc.lesson)||data.lessons.find(l=>l.weekday===schoolToday())||data.lessons[0];
}
function facultyJournal(){
 const lessons=data.lessons;
 if(!lessons.length)return header('Электронный журнал')+empty('В расписании пока нет занятий.');
 const groups=[...new Set(lessons.map(l=>l.group))].sort();
 const selGroup=svc.group&&groups.includes(svc.group)?svc.group:groups[0];
 // All students of the selected group (stable list, independent of date)
 const groupStudents=groupRoster(selGroup);
 const groupLessons=lessons.filter(l=>l.group===selGroup);
 const pairMap=new Map();
 for(const l of groupLessons){
  const key=`${l.weekday}-${l.begins}-${l.subject}`;
  if(!pairMap.has(key))pairMap.set(key,l);
 }
 const pairs=[...pairMap.values()].sort((a,b)=>a.weekday-b.weekday||a.begins.localeCompare(b.begins));
 const selLesson=pairs.find(l=>l.id===svc.lesson)||pairs[0];
 if(!selLesson)return header('Электронный журнал')+empty('Нет пар в выбранной группе.');
 const names={'Посещение':'Присутствовал(а)','Пропуск':'Отсутствовал(а)'};
 const studentRows=groupStudents.map(d=>{
  const student=d.user;
  // Find the actual lesson entry for this student on the selected slot
  const studentLesson=scheduleFor(d).find(l=>l.weekday===selLesson.weekday&&l.begins===selLesson.begins&&l.subject===selLesson.subject&&l.teacher===data.user.registerName);
  const lessonId=studentLesson?studentLesson.id:selLesson.id;
  const row=sharedRows.find(r=>r.kind==='journal'&&r.owner===student.id&&r.subject===selLesson.subject&&r.date===lessonDate(selLesson.weekday)&&r.begins===selLesson.begins);
  const demo=studentLesson?demoMark(student.id,studentLesson):{attendance:'Посещение',grade:''};
  const attendance=row?.attendance||names[demo.attendance]||demo.attendance;
  const grade=row?.grade??demo.grade;
  return `<div class="journal-student-row">
   <div class="student-info"><strong>${esc(student.name)}</strong></div>
   <form data-service-form="faculty-journal" class="journal-form">
    <input type="hidden" name="lesson_id" value="${esc(lessonId)}">
    <input type="hidden" name="student_id" value="${esc(student.id)}">
    <label class="field"><span>Посещаемость</span><select name="attendance">${options(attendanceKinds.map(s=>[s,s]),attendance)}</select></label>
    <label class="field"><span>Оценка</span><select name="grade">${options([['','Без оценки'],...['2','3','4','5'].map(s=>[s,s])],grade)}</select></label>
    <button class="btn btn-primary btn-tiny" type="submit">Сохранить</button>
   </form>
  </div>`;
 }).join('');
 const groupOpts=groups.map(g=>[g,g]);
 const pairOpts=pairs.map(p=>[p.id,`${shorts[p.weekday]} · ${shortDate(lessonDate(p.weekday))} · ${p.begins}–${p.ends} · ${p.subject}`]);
 return header('Электронный журнал','Выберите группу, затем пару. Состав группы не меняется при переключении даты.')+
 `<section class="card">
  <div class="select-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
   ${selector('faculty-group','Группа',groupOpts,selGroup)}
   ${selector('faculty-pair','Дата и пара',pairOpts,selLesson.id)}
  </div>
  <div class="card-header"><h2>${esc(selLesson.subject)}</h2><span class="label-chip">${esc(selGroup)} · ${esc(selLesson.begins)}–${esc(selLesson.ends)} · ${groupStudents.length} студентов</span></div>
  <div class="journal-students">${studentRows||empty('В группе нет студентов.')}</div>
 </section>`;
}
function demoMark(uid,lesson){
 const all=scheduleFor(directory.find(d=>d.user.id===uid)).filter(l=>l.weekday<=schoolToday());
 const n=(all.findIndex(l=>l.id===lesson.id)+(uid==='demo-anna'?0:3))%8;
 return {attendance:n===5?'Пропуск':'Посещение',grade:['5','','4','','5','','','4'][n]||''};
}
function groupRoster(group){return directory.filter(d=>d.user.group===group);}
function facultyPeople(lessons=data.lessons){return [...new Set(lessons.map(l=>l.group))].sort().flatMap(groupRoster);}
function facultyMessages(){
 const people=facultyPeople(),student=people.find(d=>d.user.id===svc.student)?.user||people[0]?.user;
 if(!student)return header('Связь со студентами')+empty('Студентов в ваших группах пока нет.');
 const teacher=data.user.registerName,rows=orderByTime(sharedRows.filter(r=>r.kind==='teacher-message'&&r.thread===threadKey(student.id,teacher)));
 return header('Связь со студентами','Демонстрационная переписка со студентами ваших групп.')+
 `<div class="service-columns"><section class="card"><h2>Мои студенты</h2>${people.map(d=>`<button class="pick-row" data-svc="recipient" data-record="${esc(d.user.id)}" aria-pressed="${d.user.id===student.id}"><strong>${esc(d.user.name)}</strong><small>${esc(d.user.group)}</small></button>`).join('')}</section><section class="card" id="service-thread" tabindex="-1"><h2>${esc(student.name)}</h2><p class="service-caption">${esc(student.group)}</p>${threadBody(rows,'teacher')}${replyForm('faculty-message')}</section></div>`;
}
async function facultySubmit(type,fields,active){
 if(!teaching())throw Error('Войдите в аккаунт преподавателя.');
 const u=data.user,time=new Date().toISOString();let record;
 if(type==='faculty-journal'){
  const studentId=fields.student_id,lessonId=fields.lesson_id,attendance=fields.attendance,grade=fields.grade||'';
  if(!studentId||!attendanceKinds.includes(attendance)||!['','2','3','4','5'].includes(grade))throw Error('Проверьте отметки занятия.');
  const dirStudent=directory.find(d=>d.user.id===studentId);
  const realLesson=dirStudent&&scheduleFor(dirStudent).find(x=>x.id===lessonId);
  const l=realLesson||data.lessons.find(x=>x.id===lessonId);
  if(!l)throw Error('Пара не найдена.');
  record={kind:'journal',id:journalKey(studentId,l),owner:studentId,lesson:l.id,subject:l.subject,date:lessonDate(l.weekday),begins:l.begins,teacher:u.registerName,attendance,grade,time};
 }else{
  const recipient=facultyPeople().find(d=>d.user.id===svc.student)||facultyPeople()[0];
  if(!recipient)throw Error('Выберите студента своей группы.');
  record={kind:'teacher-message',id:crypto.randomUUID(),owner:recipient.user.id,teacher:u.registerName,thread:threadKey(recipient.user.id,u.registerName),author:u.name,role:'teacher',body:requiredText(fields.body,2500,'Сообщение'),time};
 }
 await storeShared(record);if(active!==session)return;
 const latest=await api('dashboard');if(active!==session)return;
 data=latest;render();serviceMessage(type==='faculty-journal'?'Запись в журнале сохранена.':'Сообщение отправлено.');
}

const actionTypes={
 personal:{name:'Своя задача',description:'Личная учебная задача. Отметьте её выполненной, когда закончите.',field:'Название задачи',example:'Подготовить перевод текста'},
 certificate:{name:'Запросить справку',description:'Сначала появится задача. Из неё можно будет отправить запрос справки и отслеживать ответ.',field:'Для чего нужна справка',example:'Для образовательной программы'},
 resit:{name:'Согласовать пересдачу',description:'Подготовьте задачу для согласования пересдачи с учебным отделом.',field:'Дисциплина',example:'История языка'},
 credit:{name:'Уточнить перезачёт',description:'Из задачи можно будет подать обращение о перезачёте дисциплины.',field:'Дисциплина',example:'Иностранный язык'},
 question:{name:'Обращение в деканат',description:'Сохраните тему обращения. Текст можно проверить перед отправкой в деканат.',field:'Тема обращения',example:'Уточнить срок подачи документов'}
};
function createAction(d,input,now){
 const type=Object.hasOwn(actionTypes,input.type)?actionTypes[input.type]:null;
 const topic=String(input.topic||'').trim(),comment=String(input.comment||'').trim(),deadline=input.deadline||null;
 if(!type || !topic || topic.length>110 || comment.length>1000)throw new Error('Проверьте название задачи и длину комментария.');
 if(deadline && (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)||Number.isNaN(Date.parse(deadline))||new Date(deadline).toISOString().slice(0,10)!==deadline))throw new Error('Укажите существующую дату.');
 const personal=input.type==='personal',cert=input.type==='certificate';
 const title=personal||input.type==='question'?topic:type.name+' · '+topic;
 const reason=personal?(comment||'Личная учебная задача.'):cert?'Нужна справка для указанной цели.':input.type==='resit'?'Согласуйте дату и условия пересдачи по выбранной дисциплине.':input.type==='credit'?'Уточните возможность перезачёта у сотрудника учебного отдела.':'Подготовьте вопрос сотруднику деканата.';
 const proposed=cert?'Прошу подготовить справку об обучении. Назначение — '+topic+'.':input.type==='resit'?'Прошу согласовать пересдачу по дисциплине «'+topic+'».':input.type==='credit'?'Прошу уточнить порядок перезачёта по дисциплине «'+topic+'».':topic;
 const action={id:crypto.randomUUID(),title,reason,deadline,user_created:true,state:'open',importance:input.type==='resit'?'high':'normal',
  owner:personal?d.user.name:'Учебный отдел',action_type:personal?'personal':'request',source:'Добавлено студентом',updated_at:now,steps:[],
  prerequisites:personal?'':'Проверьте текст обращения перед отправкой.',comment};
 if(!personal)Object.assign(action,{request_kind:cert?'certificate':'general',proposed_title:title.slice(0,120),proposed_text:proposed+(comment?'\n'+comment:''),steps:['Подготовить обращение.','Отправить и проверить статус заявки.']});
 d.actions.unshift(action);return action;
}
const taskDialog=$('#task-dialog'), taskForm=$('#task-form');
let actionDraftOwner=null;
function taskFields(){
 const type=(teaching()?teachingTypes:actionTypes)[$('#task-type').value];
 $('#task-fields').hidden=!type;$('#task-save').disabled=!type;$('#task-topic').disabled=!type;
 if(!type)return;
 $('#task-description').textContent=type.description;
 $('#task-caption').textContent=type.field;
 $('#task-topic').placeholder=type.example;
}
function openTask(){
 $('#task-type').innerHTML='<option value="">Выберите тип задачи</option>'+Object.entries(teaching()?teachingTypes:actionTypes).map(([k,v])=>'<option value="'+k+'">'+esc(v.name)+'</option>').join('');
 taskForm.reset();$('#task-error').hidden=true;
 actionDraftOwner=data.user.id;taskFields();taskDialog.showModal();$('#task-type').focus();
}
$('#task-type').addEventListener('change',()=>{$('#task-topic').value='';taskFields();});
$('#task-cancel').addEventListener('click',()=>taskDialog.close());
taskForm.addEventListener('submit',async event=>{
 event.preventDefault();
 if(!data||data.user.id!==actionDraftOwner)return;
 const save=$('#task-save');if(save.disabled)return;
 const payload={type:$('#task-type').value,topic:$('#task-topic').value,deadline:$('#task-deadline').value,comment:$('#task-comment').value};
 save.disabled=true;
 try{
  const created=await api('actions',{body:payload});data=await api('dashboard');taskDialog.close();
  history.replaceState(null,'',itemUrl('actions',created.id));render();
  document.getElementById('actions-'+created.id)?.focus();flashInWorkspace('Добавлена задача «'+created.title+'».');notice('Задача добавлена.');
 }catch(error){const message=$('#task-error');message.textContent=error.message;message.hidden=false;}
 finally{save.disabled=false;}
});

const directory=[{"user":{"id":"demo-anna","name":"Анна Морозова","group":"ЛГ-201"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"a1"},{"weekday":1,"begins":"10:45","ends":"12:15","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"a2"},{"weekday":2,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"a3"},{"weekday":2,"begins":"09:50","ends":"11:20","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"a4"},{"weekday":3,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"a5"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"a6"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":"Перенесено с 11:40; аудитория Б-215","changed_at":"2026-11-21T08:00:00.000Z","id":"a7"},{"weekday":6,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":"Перенесено с 09:00","changed_at":"2026-11-21T08:00:00.000Z","id":"a8"},{"weekday":4,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-anna-9"}]},{"user":{"id":"demo-max","name":"Максим Соколов","group":"ПИ-302"},"lessons":[{"weekday":1,"begins":"10:45","ends":"12:15","subject":"Базы данных","kind":"Лекция","room":"В-304","teacher":"В. А. Лебедев","change_note":null,"changed_at":null,"id":"m1"},{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Веб-разработка","kind":"Практика","room":"В-206","teacher":"М. И. Павлова","change_note":null,"changed_at":null,"id":"m2"},{"weekday":3,"begins":"09:00","ends":"10:30","subject":"Проектирование интерфейсов","kind":"Семинар","room":"В-308","teacher":"Н. П. Юдина","change_note":null,"changed_at":null,"id":"m3"},{"weekday":3,"begins":"10:45","ends":"12:15","subject":"Базы данных","kind":"Практика","room":"В-305","teacher":"В. А. Лебедев","change_note":null,"changed_at":null,"id":"m4"},{"weekday":5,"begins":"11:40","ends":"13:10","subject":"Компьютерные сети","kind":"Лекция","room":"В-407","teacher":"А. В. Данилов","change_note":null,"changed_at":null,"id":"m5"},{"weekday":6,"begins":"13:30","ends":"15:00","subject":"Веб-разработка","kind":"Практика","room":"В-206","teacher":"М. И. Павлова","change_note":"Перенесено с 11:40","changed_at":"2026-11-21T08:00:00.000Z","id":"m6"}]},{"user":{"id":"demo-sofia","name":"София Иванова","group":"ЛГ-201"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-sofia-1"},{"weekday":1,"begins":"10:45","ends":"12:15","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-sofia-2"},{"weekday":2,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sofia-3"},{"weekday":2,"begins":"09:50","ends":"11:20","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-sofia-4"},{"weekday":3,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-sofia-5"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-sofia-6"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":"Перенесено с 11:40; аудитория Б-215","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-sofia-7"},{"weekday":6,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":"Перенесено с 09:00","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-sofia-8"},{"weekday":4,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-sofia-9"}]},{"user":{"id":"demo-dmitry","name":"Дмитрий Кузнецов","group":"ЛГ-202"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-dmitry-1"},{"weekday":3,"begins":"11:40","ends":"13:10","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-dmitry-2"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-dmitry-3"},{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-dmitry-extra-4"},{"weekday":4,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-dmitry-extra-5"},{"weekday":6,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-dmitry-extra-6"},{"weekday":1,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":null,"changed_at":null,"id":"demo-dmitry-extra-7"},{"weekday":3,"begins":"08:00","ends":"09:30","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-dmitry-extra-8"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-dmitry-pak-9"},{"weekday":5,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-dmitry-pak-10"},{"weekday":3,"begins":"13:30","ends":"15:00","subject":"Разговорный корейский","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-dmitry-pak-11"}]},{"user":{"id":"demo-elena","name":"Елена Смирнова","group":"ЛГ-202"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-elena-1"},{"weekday":3,"begins":"11:40","ends":"13:10","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-elena-2"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-elena-3"},{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-elena-extra-4"},{"weekday":4,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-elena-extra-5"},{"weekday":6,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-elena-extra-6"},{"weekday":1,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":null,"changed_at":null,"id":"demo-elena-extra-7"},{"weekday":3,"begins":"08:00","ends":"09:30","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-elena-extra-8"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-elena-pak-9"},{"weekday":5,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-elena-pak-10"},{"weekday":3,"begins":"13:30","ends":"15:00","subject":"Разговорный корейский","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-elena-pak-11"}]},{"user":{"id":"demo-ivan","name":"Иван Петров","group":"ПИ-304"},"lessons":[{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Веб-разработка","kind":"Практика","room":"В-206","teacher":"М. И. Павлова","change_note":null,"changed_at":null,"id":"demo-ivan-1"},{"weekday":4,"begins":"09:00","ends":"10:30","subject":"Базы данных","kind":"Лекция","room":"В-304","teacher":"В. А. Лебедев","change_note":null,"changed_at":null,"id":"demo-ivan-2"},{"weekday":6,"begins":"11:40","ends":"13:10","subject":"Компьютерные сети","kind":"Лекция","room":"В-407","teacher":"А. В. Данилов","change_note":null,"changed_at":null,"id":"demo-ivan-3"}]},{"user":{"id":"demo-olga","name":"Ольга Новикова","group":"ПИ-304"},"lessons":[{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Веб-разработка","kind":"Практика","room":"В-206","teacher":"М. И. Павлова","change_note":null,"changed_at":null,"id":"demo-olga-1"},{"weekday":4,"begins":"09:00","ends":"10:30","subject":"Базы данных","kind":"Лекция","room":"В-304","teacher":"В. А. Лебедев","change_note":null,"changed_at":null,"id":"demo-olga-2"},{"weekday":6,"begins":"11:40","ends":"13:10","subject":"Компьютерные сети","kind":"Лекция","room":"В-407","teacher":"А. В. Данилов","change_note":null,"changed_at":null,"id":"demo-olga-3"}]},{"user":{"id":"demo-maria","name":"Мария Козлова","group":"ЛГ-201"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-maria-1"},{"weekday":1,"begins":"10:45","ends":"12:15","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-maria-2"},{"weekday":2,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-maria-3"},{"weekday":2,"begins":"09:50","ends":"11:20","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-maria-4"},{"weekday":3,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-maria-5"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-maria-6"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":"Перенесено с 11:40; аудитория Б-215","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-maria-7"},{"weekday":6,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":"Перенесено с 09:00","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-maria-8"},{"weekday":4,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-maria-9"}]},{"user":{"id":"demo-alexey","name":"Алексей Волков","group":"ЛГ-201"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-alexey-1"},{"weekday":1,"begins":"10:45","ends":"12:15","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-alexey-2"},{"weekday":2,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-alexey-3"},{"weekday":2,"begins":"09:50","ends":"11:20","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-alexey-4"},{"weekday":3,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-alexey-5"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-alexey-6"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":"Перенесено с 11:40; аудитория Б-215","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-alexey-7"},{"weekday":6,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":"Перенесено с 09:00","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-alexey-8"},{"weekday":4,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-alexey-9"}]},{"user":{"id":"demo-natalia","name":"Наталья Белова","group":"ЛГ-201"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-natalia-1"},{"weekday":1,"begins":"10:45","ends":"12:15","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-natalia-2"},{"weekday":2,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-natalia-3"},{"weekday":2,"begins":"09:50","ends":"11:20","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-natalia-4"},{"weekday":3,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-natalia-5"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-natalia-6"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":"Перенесено с 11:40; аудитория Б-215","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-natalia-7"},{"weekday":6,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":"Перенесено с 09:00","changed_at":"2026-11-21T08:00:00.000Z","id":"demo-natalia-8"},{"weekday":4,"begins":"10:45","ends":"12:15","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-natalia-9"}]},{"user":{"id":"demo-sergey","name":"Сергей Орлов","group":"ЛГ-202"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sergey-1"},{"weekday":3,"begins":"11:40","ends":"13:10","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-sergey-2"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-sergey-3"},{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sergey-extra-4"},{"weekday":4,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-sergey-extra-5"},{"weekday":6,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sergey-extra-6"},{"weekday":1,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":null,"changed_at":null,"id":"demo-sergey-extra-7"},{"weekday":3,"begins":"08:00","ends":"09:30","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-sergey-extra-8"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sergey-pak-9"},{"weekday":5,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sergey-pak-10"},{"weekday":3,"begins":"13:30","ends":"15:00","subject":"Разговорный корейский","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-sergey-pak-11"}]},{"user":{"id":"demo-irina","name":"Ирина Павлова","group":"ЛГ-202"},"lessons":[{"weekday":1,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-irina-1"},{"weekday":3,"begins":"11:40","ends":"13:10","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-irina-2"},{"weekday":5,"begins":"13:30","ends":"15:00","subject":"Теория перевода","kind":"Лекция","room":"А-421","teacher":"И. Д. Орлова","change_note":null,"changed_at":null,"id":"demo-irina-3"},{"weekday":2,"begins":"10:45","ends":"12:15","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-irina-extra-4"},{"weekday":4,"begins":"09:00","ends":"10:30","subject":"Практический английский","kind":"Практика","room":"А-304","teacher":"Е. В. Ким","change_note":null,"changed_at":null,"id":"demo-irina-extra-5"},{"weekday":6,"begins":"08:00","ends":"09:30","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-irina-extra-6"},{"weekday":1,"begins":"13:30","ends":"15:00","subject":"Цифровые инструменты переводчика","kind":"Практика","room":"Б-215","teacher":"П. И. Волков","change_note":null,"changed_at":null,"id":"demo-irina-extra-7"},{"weekday":3,"begins":"08:00","ends":"09:30","subject":"История языка","kind":"Семинар","room":"А-419","teacher":"А. Р. Ли","change_note":null,"changed_at":null,"id":"demo-irina-extra-8"},{"weekday":4,"begins":"11:40","ends":"13:10","subject":"Корейский язык","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-irina-pak-9"},{"weekday":5,"begins":"09:00","ends":"10:30","subject":"Корейский язык","kind":"Практика","room":"А-310","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-irina-pak-10"},{"weekday":3,"begins":"13:30","ends":"15:00","subject":"Разговорный корейский","kind":"Практика","room":"А-312","teacher":"С. Н. Пак","change_note":null,"changed_at":null,"id":"demo-irina-pak-11"}]}];
const campusEvents=[
 {id:'translation-lab',title:'Мастерская синхронного перевода',date:'2026-11-24',time:'16:30–18:00',place:'Корпус А · лаборатория 310',host:'Кафедра перевода',description:'Разберите короткое выступление, попробуйте перевод в паре и обсудите решения с преподавателем. Участие открыто студентам всех направлений.'},
 {id:'product-evening',title:'Вечер студенческих проектов',date:'2026-11-26',time:'17:00–18:30',place:'Корпус В · проектный зал',host:'Студенческое проектное бюро',description:'Команды покажут прототипы и ответят на вопросы. Можно познакомиться с участниками и обсудить идею собственного проекта.'},
 {id:'archive',title:'Практикум по цифровым архивам',date:'2026-11-28',time:'11:00–12:30',place:'Библиотека · зал 2',host:'Университетская библиотека',description:'Научитесь искать первоисточники, оформлять ссылки и сохранять материалы для курсовой работы.'}
];
const categories=['Проект','Достижение','Сертификат','Учебная работа'];
const attendanceKinds=['Присутствовал(а)','Отсутствовал(а)','Уважительная причина'];
const stamp=new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:zone});
const when=t=>stamp.format(new Date(t));
function requiredText(value,max,label){
 const t=String(value??'').trim();
 if(!t||t.length>max)throw new Error('Проверьте поле «'+label+'».');
 return t;
}
function portfolioValues(input){
 const title=requiredText(input.title,120,'Название'),category=input.category;
 if(!categories.includes(category))throw Error('Выберите категорию.');
 const description=requiredText(input.description,2500,'Описание');
 const dateValue=input.date;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)||!Number.isFinite(Date.parse(dateValue))||new Date(dateValue).toISOString().slice(0,10)!==dateValue)throw Error('Укажите дату работы.');
 const link=String(input.link||'').trim();
 if(link){let url;try{url=new URL(link)}catch{}if(!url||!['https:','http:'].includes(url.protocol))throw Error('Укажите ссылку, начинающуюся с https:// или http://.');}
 return {title,category,description,date:dateValue,link};
}
function privateServiceTransition(d,path,input,now){
 if(path==='services/event'){
  if(!campusEvents.some(e=>e.id===input.id))throw Error('Мероприятие не найдено.');
  d.eventRegistrations ||= {};
  if(input.registered)d.eventRegistrations[input.id] ||= now;
  else delete d.eventRegistrations[input.id];
  return {};
 }
 d.portfolio ||= [];
 if(path==='services/portfolio/remove'){
  d.portfolio=d.portfolio.filter(p=>p.id!==input.id);return {};
 }
 if(path!=='services/portfolio/save')throw Error('Операция недоступна.');
 const values=portfolioValues(input);
 if(input.id){
  const item=d.portfolio.find(p=>p.id===input.id);if(!item)throw Error('Работа уже удалена.');
  item.attachments=(item.attachments||[]).filter(a=>!input.removed.includes(a.id)).concat(input.additions);
  Object.assign(item,values,{updated:now});return item;
 }
 const item={...values,attachments:input.additions||[],id:crypto.randomUUID(),updated:now};d.portfolio.unshift(item);return item;
}
// One entry per message, support case, or student's lesson. Appends never rewrite chat history.
let sharedDB, sharedRows=[];
const servicePrefix='nexus.campus.services.v1.';
function serviceDatabase(){
 if(!sharedDB)sharedDB=new Promise((resolve,reject)=>{
  const req=indexedDB.open('nexus.campus.services.v1',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('records',{keyPath:'id'});
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 }).catch(()=>null);
 return sharedDB;
}
async function readShared(){
 const db=await serviceDatabase();
 if(!db){
  const rows=[];try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(servicePrefix))rows.push(JSON.parse(localStorage.getItem(key)));}}catch{}
  return rows;
 }
 return new Promise((resolve,reject)=>{const req=db.transaction('records').objectStore('records').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(Error('Не удалось открыть локальные записи.'));});
}
async function storeShared(record){
 const active=session;if(!active)throw Error('Войдите в кабинет.');
 const u=active.seed.user;
 const ownSupport=['case','support-message'].includes(record.kind)&&record.owner===u.id&&record.role==='student';
 const ownChat=record.kind==='teacher-message'&&record.owner===u.id&&record.role==='student';
 const staffRecord=u.role==='teacher'&&scopedRecords([record],active).length&&(record.kind==='journal'||(record.kind==='teacher-message'&&record.role==='teacher'));
 if(!(ownSupport||staffRecord||(u.role!=='teacher'&&ownChat)))throw Error('Запись недоступна этому аккаунту.');
 const db=await serviceDatabase();
 if(!db){try{localStorage.setItem(servicePrefix+record.id,JSON.stringify(record));}catch{throw Error('Браузер не смог сохранить запись. Проверьте настройки хранения данных.');}}
 else await new Promise((resolve,reject)=>{
  const tx=db.transaction('records','readwrite');tx.objectStore('records').put(record);
  tx.oncomplete=resolve;tx.onabort=()=>reject(Error('Запись не сохранена. Попробуйте ещё раз.'));
 });
 const rows=await readShared();if(session===active)sharedRows=scopedRecords(rows,active);
}
function freshServiceView(){return {staff:false,agent:false,student:'',teacher:'',subject:'',lesson:'',ticket:''};}
let svc=freshServiceView();
function rosterUser(id){return directory.find(d=>d.user.id===id)?.user}
function lessonsFor(id){return id===data.user.id?data.lessons:scheduleFor(directory.find(d=>d.user.id===id));}
function staffStudent(){return svc.staff&&rosterUser(svc.student)?svc.student:data.user.id}
function teacherBook(id){
 const byName=new Map();
 for(const l of lessonsFor(id)){if(!byName.has(l.teacher))byName.set(l.teacher,new Set());byName.get(l.teacher).add(l.subject);}
 return [...byName].map(([name,subjects])=>({name,subjects:[...subjects]})).sort((a,b)=>a.name.localeCompare(b.name,'ru'));
}
const threadKey=(id,teacher)=>JSON.stringify([id,teacher]);
function orderByTime(rows){return rows.slice().sort((a,b)=>a.time.localeCompare(b.time)||a.id.localeCompare(b.id));}
function supportHistory(ticket){
 return orderByTime(sharedRows.filter(r=>r.id===ticket.id || (r.kind==='support-message' && r.thread===ticket.id && r.owner===ticket.owner)));
}
function supportState(ticket){return supportHistory(ticket).at(-1)?.role==='support'?'Ответ поддержки':'Ожидает ответа';}
function ticketsForView(){return sharedRows.filter(r=>r.kind==='case'&&r.owner===data.user.id).sort((a,b)=>b.time.localeCompare(a.time));}

function transition(d, path, input) {
 const now = new Date().toISOString();
 if(d.user.role==='teacher'){
  if(path==='actions'){
   if(!Object.hasOwn(teachingTypes,input.type))throw Error('Выберите тип рабочей задачи.');
   const item=createAction(d,{...input,type:'personal'},now);
   item.source='Добавлено преподавателем';item.reason=item.comment||teachingTypes[input.type].name;return item;
  }
  if(!/^actions\/[^/]+\/complete$/.test(path))throw Error('Операция недоступна для этого аккаунта.');
 }
 const addNotice = (title,body,link) => d.notifications.unshift({id:crypto.randomUUID(),category:'request',title,body,link,created_at:now,read_at:null});
 if(path.startsWith('services/'))return privateServiceTransition(d,path,input,now);
 if(path==='actions')return createAction(d,input,now);
 if(path==='notifications/read') {
  d.notifications.forEach(n=>n.read_at ||= now); return {};
 }
 if(path==='requests') {
  const title=input.title.trim(), description=input.description.trim();
  if(title.length<3||description.length<5||title.length>120||description.length>2000) throw new Error('Укажите тему от 3 символов и описание от 5 символов.');
  const action=input.action_id ? d.actions.find(a=>a.id===input.action_id) : null;
  if(input.action_id && (!action || action.state!=='open' || action.action_type!=='request')) throw new Error('Шаг уже обработан или ещё недоступен. Откройте его заново.');
  const ticket={id:crypto.randomUUID(),kind:input.kind==='certificate'?'certificate':'general',title,description,status:'Получено',created_at:now,updated_at:now,action_id:action?.id};
  d.requests.unshift(ticket);
  if(action){action.state='waiting';action.linked_request_id=ticket.id}
  addNotice('Заявка зарегистрирована',title,'#requests');
  return ticket;
 }
 const [,id,operation] = path.split('/');
 if(operation==='complete'){
  const task=d.actions.find(a=>a.id===id && a.action_type==='personal');
  if(!task)throw new Error('Личная задача не найдена.');
  task.state='done';return {};
 }
 if(operation==='ack'){
  const a=d.actions.find(a=>a.id===id && a.action_type==='ack');
  if(!a)throw new Error('Задача недоступна.');
  a.state='done'; return {};
 }
 if(operation==='advance'){
  const ticket=d.requests.find(t=>t.id===id);
  if(!ticket || ticket.status!==input.from)throw new Error('Статус уже изменился. Откройте историю заявок ещё раз.');
  const next={'Получено':'В работе','В работе':'Готово'}[ticket.status];
  if(!next)throw new Error('Заявка завершена.');
  ticket.status=next;ticket.updated_at=now;
  if(next==='Готово'){
   const related=d.actions.find(a=>a.linked_request_id===id || a.id===ticket.action_id);
   if(related){related.state='ready';d.actions.filter(a=>a.depends_on===related.id&&a.state==='blocked').forEach(a=>a.state='open')}
  }
  addNotice('Обновился статус заявки',ticket.title+' · '+next,'#requests');
  return {};
 }
 throw new Error('Задача недоступна.');
}
async function api(path,{body={}}={}) {
 if(path==='login'){
  if(!globalThis.crypto?.subtle)throw new Error('Для входа откройте скачанный HTML в Safari, Chrome или Edge либо откройте сайт по HTTPS.');
  const id=body.email.trim().toLowerCase(), box=envelopes[id];
  if(!box)throw new Error('Проверьте логин и пароль.');
  const material=await crypto.subtle.importKey('raw',encoder.encode(body.password),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(box.salt),iterations:600000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  let seed;
  try{seed=await unlock(key,bytes(box.iv),bytes(box.ciphertext))}catch{throw new Error('Проверьте логин и пароль.')}
  const storageKey=seed.storageKey?await crypto.subtle.importKey("raw",bytes(seed.storageKey),"AES-GCM",false,["encrypt","decrypt"]):key;delete seed.storageKey;await openDatabase();session={id,key:storageKey,seed};return {};
 }
 if(path==='logout'){svc=freshServiceView();sharedRows=[];session=null;compose=null;period='day';day=schoolToday();return {}}
 const active=session;
 if(!active)throw Object.assign(new Error('Войдите в кабинет.'),{status:401});
 for(let attempt=0;attempt<4;attempt++){
  const {revision,dashboard}=await getSnapshot(active);
  if(session!==active)throw new Error('Сеанс завершён.');
  if(path==='dashboard'){const records=await readShared();if(active!==session)throw Error('Сеанс завершён.');sharedRows=scopedRecords(records,active);return teaching()?facultyDashboard(dashboard,sharedRows):{...dashboard,lessons:scheduleFor(dashboard)};}
  const result=transition(dashboard,path,body);
  if(await commit(active,revision,dashboard))return result;
 }
 throw new Error('Данные изменились в другой вкладке. Откройте раздел ещё раз.');
}

function flashInWorkspace(message,error=false){
 const marker=$('.page-heading',el.workspace)||$('.welcome',el.workspace);
 if(marker)marker.insertAdjacentHTML('afterend',state(message,error?'error':''));
 else el.workspace.insertAdjacentHTML('afterbegin',state(message,error?'error':''));
}
function showLanding(){configureLanding(false);data=null;el.login.reset();$('#side-name').textContent='';$('#side-group').textContent='';$('#side-avatar').textContent='';$('#top-avatar').textContent='';el.mobileSheet.hidden=true;$('#mobile-more').setAttribute('aria-expanded','false');el.portal.hidden=true;el.landing.hidden=false;el.workspace.innerHTML='';history.replaceState(null,'',location.href.split('#')[0]);document.title='NEXUS — цифровой деканат';window.scrollTo(0,0);}
async function loadPortal({focus=false}={}){
 const updated=await api('dashboard');
 data=updated;configureMenu();$('#login-password').value='';
 el.portal.hidden=false;el.landing.hidden=true;
 const initials=updated.user.name.trim().split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
 $('#side-name').textContent=updated.user.name;$('#side-group').textContent=teaching()?'Преподаватель':updated.user.group;
 $('#side-avatar').textContent=initials;$('#top-avatar').textContent=initials;
 $('.skip').href='#workspace';
 if(!canVisit(routeName()))history.replaceState(null,'','#overview');
 render();
 if(focus && !focusRouteItem())el.workspace.focus();
}
function openLogin(){
 el.login.reset();el.error.hidden=true;
 if(!el.dialog.open)el.dialog.showModal();
 $('#login-email').focus();
}
let entryDestination=null;
function enterSection(page){
 const target=Object.hasOwn(labels,page)?page:'overview';
 if(session && data){
  history.replaceState(null,'','#'+target);
  el.landing.hidden=true;el.portal.hidden=false;$('.skip').href='#workspace';render();window.scrollTo(0,0);el.workspace.focus();return;
 }
 entryDestination=target;openLogin();
}
$$('[data-open-login],[data-entry]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();enterSection(link.dataset.entry||'overview');}));
el.dialog.addEventListener('close',()=>{entryDestination=null;});

$('.close-dialog').addEventListener('click',()=>el.dialog.close());

el.login.addEventListener('submit',async event=>{
 event.preventDefault();const submit=$('#login-submit');submit.disabled=true;submit.textContent='Входим…';el.error.hidden=true;
 try{await api('login',{method:'POST',body:{email:$('#login-email').value,password:$('#login-password').value}});if(entryDestination)history.replaceState(null,'','#'+entryDestination);entryDestination=null;await loadPortal({focus:true});el.login.reset();el.dialog.close();if(!focusRouteItem())el.workspace.focus();notice('Вы вошли в кабинет.');}
 catch(error){el.error.textContent=error.message;el.error.hidden=false;}
 finally{submit.disabled=false;submit.innerHTML='Войти в кабинет <span aria-hidden="true">→</span>';}
});
async function signOut(){
 try{await api('logout',{method:'POST'});showLanding();$('.skip').href='#main';notice('Вы вышли из аккаунта.');}
 catch(error){flashInWorkspace(error.message,true);}
}
$('#sign-out').addEventListener('click',signOut);$('#mobile-exit').addEventListener('click',signOut);
$('#mobile-more').addEventListener('click',()=>{
 el.mobileSheet.hidden=!el.mobileSheet.hidden;
 $('#mobile-more').setAttribute('aria-expanded',String(!el.mobileSheet.hidden));
});
el.mobileSheet.addEventListener('click',event=>{if(event.target.closest('a')){el.mobileSheet.hidden=true;$('#mobile-more').setAttribute('aria-expanded','false');}});
window.addEventListener('hashchange',async()=>{
 if(!data)return;
 if(['home','features','about',''].includes(routeName())){
  el.portal.hidden=true;el.landing.hidden=false;$('.skip').href='#main';
  document.title='NEXUS — цифровой деканат';
  if(routeName()==='home'||!routeName())window.scrollTo(0,0);else document.getElementById(routeName())?.scrollIntoView();
  return;
 }
 el.landing.hidden=true;el.portal.hidden=false;$('.skip').href='#workspace';
 const session=data.user.id;
 el.mobileSheet.hidden=true;$('#mobile-more').setAttribute('aria-expanded','false');
 el.workspace.innerHTML='<div class="loading-state"><span class="spinner" aria-hidden="true"></span><p>Обновляем раздел…</p></div>';
 try{const result=await api('dashboard');if(data&&result.user.id===session){data=result;}}
 catch(error){if(error.status===401){showLanding();return;}
  render();flashInWorkspace(error.message,true);return;}
 if(data){const editing=compose && route()==='requests';render();if(!editing && !focusRouteItem()){window.scrollTo({top:0,behavior:'instant'});el.workspace.focus({preventScroll:true});}}
});
function statusBadge(status){const variants={'Получено':'dark','В работе':'warning','Готово':'good','Отклонено':'warning'};return `<span class="label-chip ${variants[status]||'grey'}">${esc(status)}</span>`;}
function deadlineLabel(value){
 if(!value)return {text:'Без срока',overdue:false};
 const today=Date.parse(schoolDate()+'T00:00:00Z'),at=Date.parse(value+'T00:00:00Z');
 const difference=Math.round((at-today)/86400000);
 if(difference<0)return {text:`Просрочено на ${-difference} дн.`,overdue:true};
 if(difference===0)return {text:'Сегодня',overdue:false};
 if(difference===1)return {text:'Завтра',overdue:false};
 return {text:`Осталось ${difference} дн.`,overdue:false};
}
function actionState(action){
 return action.state==='blocked'?'Сначала получите справку':action.state==='waiting'?'Ждём ответ':action.state==='done'?(action.action_type==='personal'?'Выполнено':'Просмотрено'):action.state==='ready'?'Статус «Готово»':'Требует внимания';
}
function actionBadge(action){const style=action.state==='open'?(deadlineLabel(action.deadline).overdue?'warning':'dark'):(action.state==='done'||action.state==='ready'?'good':'grey');return `<span class="label-chip ${style}">${actionState(action)}</span>`;}
function activeActions(){return data.actions.filter(a=>a.state==='open').sort((a,b)=>{
  const rank={high:0,normal:1,low:2};return rank[a.importance]-rank[b.importance]||(a.deadline||'9999').localeCompare(b.deadline||'9999');
});}
function header(title,subtitle='',source=false){return `<header class="page-heading"><div><h1><span class="section-art art-${route()}" aria-hidden="true"></span>${esc(pageLabel(route()))}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div>${source?'<span class="source-chip">ⓘ Данные для демонстрации</span>':''}</header>`;}
function empty(text){return `<div class="empty">${esc(text)}</div>`;}
// The demo week starts on Monday. Existing lessons retain their ids and effective times.
const extraSubjects={
 'ЛГ-201':[
  ['Практический английский','Практика','Е. В. Ким','А-304'],
  ['Корейский язык','Практика','С. Н. Пак','А-312'],
  ['Теория перевода','Лекция','И. Д. Орлова','А-421'],
  ['История языка','Семинар','А. Р. Ли','А-419'],
  ['Цифровые инструменты переводчика','Практика','П. И. Волков','Б-215'],
  ['Устный перевод','Практика','О. В. Белова','А-310']
 ],
 'ПИ-302':[
  ['Базы данных','Практика','В. А. Лебедев','В-305'],
  ['Веб-разработка','Практика','М. И. Павлова','В-206'],
  ['Проектирование интерфейсов','Семинар','Н. П. Юдина','В-308'],
  ['Компьютерные сети','Лекция','А. В. Данилов','В-407'],
  ['Алгоритмы и структуры данных','Практика','А. С. Громов','В-204'],
  ['Тестирование ПО','Практика','Е. Г. Миронова','В-306']
 ]
};
const additions={
 'ЛГ-201':[
  [[1,'12:35'],[3,'14:20']], [[4,'11:40']], [[1,'09:00'],[2,'12:35'],[5,'14:20']],
  [[0,'08:00'],[5,'09:50']], [[3,'09:00'],[1,'10:45']], [[0,'12:35'],[5,'14:20']]
 ],
 'ПИ-302':[
  [[4,'09:00'],[2,'12:35']], [[0,'09:00'],[3,'12:35'],[5,'14:20']], [[4,'12:35']],
  [[1,'09:00'],[4,'10:45'],[5,'12:35'],[0,'14:20']], [[2,'08:00'],[0,'09:50']], [[5,'09:00'],[4,'10:45']]
 ]
};
function timeAfter(time,minutes){
 const [hour,minute]=time.split(':').map(Number), total=60*hour+minute+minutes;
 return String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0');
}
function scheduleFor(dashboard){
 const lessons=dashboard.lessons.slice(), profile=dashboard.user.id, group=dashboard.user.group;
 const known=new Set(lessons.map(l=>l.id));
 (additions[group]||[]).forEach((entries,i)=>entries.forEach(([index,begins])=>{
  const id=profile+'-lesson-'+(i+1)+'-'+index;
  if(known.has(id))return;
  const [subject,kind,teacher,room]=extraSubjects[group][index];
  lessons.push({id,weekday:i+1,subject,kind,teacher,room,begins,ends:timeAfter(begins,90),change_note:null});
 }));
 return lessons.sort((a,b)=>a.weekday-b.weekday || a.begins.localeCompare(b.begins));
}
function lessonDate(weekday){
 const anchor=new Date(schoolDate()+'T12:00:00Z');
 anchor.setUTCDate(anchor.getUTCDate()+weekday-schoolToday());
 return anchor.toISOString().slice(0,10);
}
function previousTime(lesson){return lesson.change_note?.match(/с\s+(\d{1,2}:\d{2})/i)?.[1]||''}
function lessonChange(lesson){
 if(!lesson.change_note)return '';
 const before=previousTime(lesson);
 return before?`Время изменилось · ${before} → ${lesson.begins}`:lesson.change_note;
}
function lecture(item,compact=false){
 const changed=lessonChange(item);
 if(compact===true)return `<button type="button" data-lesson="${esc(item.id)}" class="week-item ${changed?'changed':''}"><b>${esc(item.begins)}–${esc(item.ends)}</b><strong>${esc(item.subject)}</strong><small>${esc(item.room)} · ${esc(teaching()?'Группа '+item.group:item.teacher)}</small>${changed?`<small>${esc(changed)}</small>`:''}</button>`;
 return `<button type="button" class="lesson-line" data-lesson="${esc(item.id)}">
 <span class="lesson-time"><b>${esc(item.begins)}</b><small>${esc(item.ends)}</small></span>
 <span class="lesson-caption"><strong>${esc(item.subject)}</strong><small>${esc(item.kind)} · ${esc(item.room)} · ${esc(teaching()?'Группа '+item.group:item.teacher)}</small>${changed?`<small class="lesson-change">${esc(changed)}</small>`:''}</span><span class="chev" aria-hidden="true">›</span></button>`;
}
let lessonTrigger=null;
function openLesson(trigger){
 const lesson=data.lessons.find(l=>l.id===trigger.dataset.lesson);
 if(!lesson)return;
 lessonTrigger=trigger;
 $('#lesson-name').textContent=lesson.subject;
 $('#lesson-kind').textContent=lesson.kind;
 const entries=[['Дата',shorts[lesson.weekday]+', '+date(lessonDate(lesson.weekday))],['Время',lesson.begins+'–'+lesson.ends],
 ...(teaching()?[]:[['Преподаватель',lesson.teacher]]),['Группа',teaching()?lesson.group:data.user.group],['Корпус',lesson.room.split('-')[0]],['Аудитория',lesson.room]];
 const before=previousTime(lesson);
 $('#lesson-data').innerHTML=entries.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
 const box=$('#lesson-update');box.hidden=!lesson.change_note;
 box.textContent=before?`Перенос занятия. Раньше ${before}–${timeAfter(before,90)}. Теперь ${lesson.begins}–${lesson.ends}, аудитория ${lesson.room}.`:lesson.change_note||'';
 $('#lesson-dialog').showModal();$('#lesson-close').focus();
}
$('#lesson-close').addEventListener('click',()=>$('#lesson-dialog').close());
$('#lesson-dialog').addEventListener('close',()=>{if(lessonTrigger?.isConnected)lessonTrigger.focus({preventScroll:true});lessonTrigger=null;});

function ticketStatus(ticket){const i=['Получено','В работе','Готово'].indexOf(ticket.status);if(ticket.status==='Отклонено')return statusBadge(ticket.status);
 return `<div class="ticket-steps" aria-label="Этап рассмотрения: ${esc(ticket.status)}">${['Получено','В работе','Готово'].map((s,j)=>`<span class="${j<=i?'active':''}">${s}</span>`).join('')}</div>`;}
function notificationRow(n){return `<article class="notice-entry"><div><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p></div>${n.read_at?'':`<span class="label-chip good">Новое</span>`}</article>`;}
function requestFor(action) {
 return data.requests.find(t => t.id === action.linked_request_id || t.action_id === action.id);
}
function itemUrl(page, id) {
 return '#' + page + '/' + encodeURIComponent(id);
}
function itemLink(page, id, label, css='inline-link') {
 return `<a class="${css}" href="${esc(itemUrl(page,id))}">${esc(label)}</a>`;
}
function focusRouteItem() {
 const raw = location.hash.split('/')[1];
 if (!raw) return false;
 let id;
 try { id=decodeURIComponent(raw); } catch { return false; }
 const node=document.getElementById(route()+'-'+id);
 if (!node) return false;
 node.focus({preventScroll:true});
 node.scrollIntoView({block:'center',behavior:'instant'});
 return true;
}
function ticketRow(ticket) {
 const action=data.actions.find(a=>a.id===ticket.action_id || a.linked_request_id===ticket.id);
 const advance=['Получено','В работе'].includes(ticket.status);
 return `<article class="ticket-row" tabindex="-1" id="requests-${esc(ticket.id)}"><div class="ticket-body">
 <div class="ticket-heading"><strong>${esc(ticket.title)}</strong>${statusBadge(ticket.status)}</div>
 <p>${esc(kinds[ticket.kind]||ticket.kind)} · ${shortDate(ticket.created_at)} · № ${esc(ticket.id.slice(0,8))}</p>
 <p>${esc(ticket.description)}</p><p>Ответственный · ${esc(action?.owner||'Учебный отдел')}<br>Ориентир ответа · 2 учебных дня</p>
 ${action?`<p class="relation">Связанная задача<br>${itemLink('actions',action.id,action.title)}</p>`:''}
 ${ticketStatus(ticket)}
 ${advance?`<button type="button" class="btn btn-light btn-tiny demo-advance" data-advance="${esc(ticket.id)}" data-from="${esc(ticket.status)}">Показать следующий этап →</button><p>Демонстрация ответа сотрудника</p>`:''}</div></article>`;
}
function scenarioProgress(focus) {
 const child=data.actions.find(a=>a.depends_on && (!focus || a.id===focus.id || a.depends_on===focus.id) && data.actions.some(p=>p.id===a.depends_on));
 let title, steps, complete;
 if(child){
  const parent=data.actions.find(a=>a.id===child.depends_on);
  const first=requestFor(parent), last=requestFor(child);
  title=child.title;
  steps=['Запросить справку','Получить справку','Подать заявление'];
  complete=last?3:(first?.status==='Готово'||parent.state==='ready')?2:first?1:0;
 }else{
  const linked=focus || data.actions.find(a=>requestFor(a));
  if(!linked)return '';
  const ticket=requestFor(linked);
  steps=['Получено','В работе','Готово'];
  if(!steps.includes(ticket.status))return '';
  title=ticket.title;
  complete=steps.indexOf(ticket.status)+1;
 }
 const label=child?(complete===steps.length?'Заявление подано':steps[complete]):steps[complete-1];
 return `<aside class="scenario"><span class="overline">${child?'Связанные шаги':'Статус заявки'}</span>
 <strong>${esc(title)}</strong><div class="scenario-track" role="progressbar" aria-label="${esc(title)}" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${complete}" aria-valuetext="${esc(label)}">${steps.map((s,i)=>`<i class="${i<complete?'filled':''}"></i>`).join('')}</div>
 <p>${child?`Выполнено ${complete} из ${steps.length}`:`Этап ${complete} из ${steps.length}`} · ${esc(label)}</p></aside>`;
}
function viewOverview() {if(teaching())return facultyOverview();

 const user=data.user;
 const classes=data.lessons.filter(l=>l.weekday===schoolToday());
 const first=activeActions()[0] || data.actions.find(a=>a.state==='waiting' && requestFor(a));
 const connected=first && (first.depends_on || data.actions.some(a=>a.depends_on===first.id) || requestFor(first));
 const progress=connected?scenarioProgress(first):(first?.action_type==='request' && first.state==='open'?
  '<aside class="scenario"><span class="overline">Обращение в деканат</span><strong>Подготовка заявки</strong><div class="scenario-track" role="progressbar" aria-label="Обработка заявки" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0"><i></i><i></i><i></i></div><p>Заявка ещё не отправлена.</p></aside>':'');
 return `<section class="welcome"><span class="banner-photo" aria-hidden="true"><img alt="" src="${$('#campus-photo').src}"></span><p class="eyebrow">Учебный день · ${esc(date(schoolDate()))}</p>
 <h1><span class="section-art art-overview" aria-hidden="true"></span>Привет, ${esc(user.name.split(' ')[0])}!</h1><p>${esc(user.program)} · ${esc(user.course)} курс · ${esc(user.group)}</p></section>
 <section class="card priority"><div class="card-header"><h2>Следующий шаг</h2><a href="#actions" class="section-link">Все задачи · ${activeActions().length} →</a></div>
 <div class="priority-layout"><div class="priority-main">
 ${first?`<p class="priority-date">${first.state==='waiting'?'На рассмотрении':first.deadline?`До ${shortDate(first.deadline)} · ${esc(deadlineLabel(first.deadline).text)}`:'Ближайший шаг'}</p>
 <h3>${esc(first.title)}</h3><p>${esc(first.reason)}</p><div class="action-buttons">${first.state==='waiting'?itemLink('requests',requestFor(first).id,'Открыть заявку','btn btn-primary'):first.action_type==='ack'?'<a class="btn btn-primary" href="#schedule" data-schedule-today>Проверить расписание →</a>':actionCTA(first)}</div>`:
 '<h3>Все обязательные задачи выполнены</h3><p>Историю можно посмотреть в разделе «Мои задачи».</p>'}
 </div>${progress}</div></section>
 <div class="overview-grid"><section class="card"><div class="card-header"><h2>Сегодня <small class="header-count">${classes.length}</small></h2><a href="#schedule" data-schedule-week class="section-link">На неделю →</a></div>
 ${classes.length?classes.slice(0,4).map(lecture).join(''):empty('Сегодня занятий нет.')}
 </section>
 ${changesPanel()}</div>${serviceSpotlight()}
 <div class="overview-shortcuts"><a class="section-link" href="#requests">Все обращения →</a></div>
 <a class="academic-summary" href="#grades"><span>Успеваемость</span><span>Задолженностей · ${data.grades.filter(g=>g.state==='debt').length} →</span></a>`;
}
function actionCTA(a) {
 const linked=requestFor(a);
 if(linked)return itemLink('requests',linked.id,'Открыть заявку · '+linked.status,'btn btn-light btn-tiny');
 if(a.state==='blocked')return '';
 if(a.state==='done'||a.state==='ready')return '';
 if(a.action_type==='request' && a.state==='open')return `<button class="btn btn-primary" data-compose="${esc(a.id)}">${a.request_kind==='certificate'?'Запросить справку':'Подготовить обращение'} →</button>`;
 if(a.action_type==='personal')return `<button type="button" class="btn btn-primary" data-complete="${esc(a.id)}">Отметить выполненным</button>`;
 if(a.action_type==='ack')return `<a class="btn btn-primary" href="#schedule" data-schedule-today>Проверить расписание</a><button class="btn btn-light btn-tiny" data-ack="${esc(a.id)}">Отметить просмотренным</button>`;
 return '<a class="inline-link" href="#requests">Открыть обращения</a>';
}
function actionCard(a,index) {
 const linked=requestFor(a),closed=['ready','done'].includes(a.state);
 const steps=a.steps || [];
 const next=closed?data.actions.find(x=>x.depends_on===a.id)?.title:
  linked?(linked.status==='Получено'?'Сотрудник возьмёт заявку в работу.':linked.status==='В работе'?'Сотрудник сообщит результат в заявке.':''):
  a.state==='open' && a.action_type==='ack'?'После подтверждения перенос будет отмечен просмотренным.':
  a.state==='open' && a.action_type==='request'?'После отправки вы сможете следить за ответом в заявке.':steps.at(-1);
 const firstInstruction=linked && !closed?'Проверить текущий статус в связанной заявке.':a.prerequisites;
 if(a.user_created && a.action_type==='personal')return `<article id="actions-${esc(a.id)}" tabindex="-1" class="action-card"><div class="action-card-top">${actionBadge(a)}<span class="action-due">${a.deadline?'До '+shortDate(a.deadline):'Без срока'}</span></div><h3>${esc(a.title)}</h3>${a.comment?`<p class="action-reason">${esc(a.comment)}</p>`:''}<div class="action-buttons">${actionCTA(a)}</div></article>`;
 return `<article class="action-card ${index===0&&a.state==='open'?'is-top':''} ${closed?'action-closed':''}" tabindex="-1" id="actions-${esc(a.id)}">
 <div class="action-card-top">${actionBadge(a)}${a.deadline?`<span class="action-due">До ${shortDate(a.deadline)}</span>`:''}</div>
 <h3>${esc(a.title)}</h3><p class="action-reason">${esc(a.reason)}</p>
 <dl class="action-guide">${!closed && firstInstruction?`<div><dt>Что нужно сделать сначала</dt><dd>${esc(firstInstruction)}</dd></div>`:''}
 ${next?`<div><dt>Что произойдёт дальше</dt><dd>${esc(next)}</dd></div>`:''}</dl>
 <div class="action-buttons">${actionCTA(a)}</div>
 <details class="action-details"><summary>Подробности задачи</summary>
 <ol class="action-steps">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 <dl class="context-table">${a.consequence?`<dt>Если пропустить</dt><dd>${esc(a.consequence)}</dd>`:''}<dt>Источник</dt><dd>${esc(a.source)} · ${shortDate(a.updated_at)}</dd><dt>Ответственный</dt><dd>${esc(a.owner)}</dd></dl>
 </details></article>`;
}
function viewActions(){if(teaching())return facultyTasks();
const active=activeActions(),closed=data.actions.filter(a=>a.state!=='open'),waiting=data.actions.filter(a=>a.state==='waiting').length;
 return `<header class="task-heading page-heading"><h1><span class="section-art art-actions" aria-hidden="true"></span>Мои задачи</h1><button class="btn btn-primary" type="button" data-add-action>Добавить задачу</button></header>
 <div class="action-list">${active.length?active.map(actionCard).join(''):empty('Все задачи выполнены.')}</div>
 ${closed.length?`<section class="stack" style="margin-top:26px"><h2 style="font-size:21px">Связанные и завершённые шаги ${waiting?`· ${waiting} на рассмотрении`:''}</h2>${closed.map((a,i)=>actionCard(a,i+10)).join('')}</section>`:''}
 <p class="profile-note">Источник всех подсказок — специально созданные правила и вымышленные сроки NEXUS. Это не официальный регламент. При сомнении отправьте вопрос сотруднику через раздел <a href="#requests" class="inline-link">«Обращения»</a>.</p>`;
}
function viewSchedule(){const scheduled=data.lessons.filter(l=>l.weekday===day);
 const acknowledge=data.actions.find(a=>a.action_type==='ack' && a.state==='open');
 const select=`<select id="day-select" class="day-picker" aria-label="Выбрать день недели">${shorts.slice(1).map((name,i)=>`<option value="${i+1}" ${day===i+1?'selected':''}>${name}</option>`).join('')}</select>`;
 return header('Расписание','Учебная неделя · 16–22 ноября 2026')+
 (acknowledge?`<div class="schedule-ack"><span>${esc(acknowledge.title)}</span><button type="button" class="btn btn-light btn-tiny" data-ack="${esc(acknowledge.id)}">Отметить просмотренным</button></div>`:'')+
 `<div class="toolbar"><div class="segment" role="group" aria-label="Режим расписания"><button data-period="day" aria-pressed="${period==='day'}">День</button><button data-period="week" aria-pressed="${period==='week'}">Неделя</button></div>${period==='day'?select:''}</div>
 ${period==='day'?`<section class="card schedule-day"><h2>${shorts[day]}${day===schoolToday()?' · Сегодня':''}</h2>${scheduled.length?scheduled.map(lecture).join(''):empty('В этот день занятий нет.')}</section>`:
 `<div class="week-days">${shorts.slice(1).map((name,i)=>{const lessons=data.lessons.filter(l=>l.weekday===i+1);
 return `<section class="week-day"><h3>${name}</h3>${lessons.length?lessons.map(l=>lecture(l,true))
.join(''):'<p class="empty-mini">Нет пар</p>'}</section>`;}).join('')}</div>`}
 <p class="profile-note">Расписание демонстрационное: время занятий и переносы придуманы для прототипа. Реальных университетских данных здесь нет.</p>`;
}
function viewGrades(){const passed=data.grades.filter(g=>g.state==='passed').length,debts=data.grades.filter(g=>g.state==='debt').length,total=data.grades.length,percent=Math.round(passed/(total||1)*100);
 const exams=data.exams;
 return header('Успеваемость','Оценки, задолженности и ближайшие события сессии — в одной картине.')+
 `<div class="grade-stats"><div class="grade-stat"><span class="overline">ЗАКРЫТО</span><strong>${passed} / ${total}</strong><p>дисциплин в наборе</p></div><div class="grade-stat"><span class="overline">ЗАДОЛЖЕННОСТИ</span><strong>${debts}</strong><p>нужно обратить внимание</p></div><div class="grade-stat"><span class="overline">СЕССИЯ</span><strong>${exams.length}</strong><p>мероприятия в графике</p></div></div>
 <div class="page-grid"><section class="card"><div class="card-header"><h2>Результаты</h2><span class="label-chip good">${percent}% дисциплин закрыто</span></div><div class="progress-rail" role="progressbar" aria-label="Доля закрытых дисциплин" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div style="width:${percent}%"></div></div><p class="muted tiny" style="margin-bottom:12px">Показатель рассчитан только по демонстрационным дисциплинам, не является официальным академическим рейтингом.</p>${data.grades.map(g=>`<article class="grade-row"><div><strong>${esc(g.subject)}</strong><p>${esc(g.assessment)}${g.points!==null?` · ${esc(g.points)} / 100`:''}</p></div><span class="label-chip ${g.state==='passed'?'good':g.state==='debt'?'warning':'grey'}">${esc(g.result)}</span></article>`).join('')||empty('Оценок пока нет.')}</section>
 <section class="card"><h2>Моя сессия</h2><p class="muted tiny" style="margin:0 0 17px">Время и даты для учебного примера. При вопросах о пересдаче обращайтесь к сотруднику.</p>${exams.map(e=>`<article class="exam-row"><time datetime="${esc(e.date)}">${shortDate(e.date)}<br>${esc(e.begins)}</time><div><strong>${esc(e.subject)}</strong><p>${esc(e.kind)} · ${esc(e.room)}</p></div><span class="label-chip ${e.status.includes('согласования')?'warning':'grey'}">${esc(e.status)}</span></article>`).join('')||empty('Мероприятий пока нет.')}<a href="#actions" class="section-link" style="display:inline-block;margin-top:18px">Какие задачи требуют внимания? ↗</a></section></div>`;
}
function viewRequests(){return header('Обращения','Запросите справку или задайте вопрос. У каждого обращения есть свой номер и статус.')+
 `<div class="request-grid"><section class="card"><h2>Новое обращение</h2><p class="muted tiny" style="margin-bottom:20px">Заявка сохранится в этом браузере. Для обращения по учебной задаче откройте форму из раздела «Мои задачи».</p>
 <form id="request-form"><label class="field">Тип обращения<select id="request-kind" name="kind" required><option value="general">Вопрос или заявление</option><option value="certificate">Запрос справки</option></select></label>
 <label class="field">Тема<input id="request-title" name="title" required minlength="3" maxlength="120" placeholder="Например, справка об обучении"></label>
 <label class="field">Описание<textarea id="request-desc" name="description" required minlength="5" maxlength="2000" placeholder="Кратко опишите, что нужно сделать"></textarea><small>Не вводите реальные персональные данные в конкурсном прототипе.</small></label>
 <input type="hidden" id="request-action" name="action_id" value=""><p id="request-note" class="form-note" hidden role="status"></p><button type="submit" class="btn btn-primary" id="request-submit">Отправить обращение ↗</button></form></section>
 <section class="request-history"><div class="card-header"><h2>История заявок</h2><span class="label-chip grey">${data.requests.length} всего</span></div>${data.requests.length?data.requests.map(ticketRow).join(''):empty('Пока нет заявок. Заполните форму для нового обращения.')}</section></div>
 <p class="profile-note">Статусы в демоверсии: «Получено» → «В работе» → «Готово». Кнопка «Показать следующий этап» имитирует ответ сотрудника.</p>`;}
function viewNotifications(){const unread=data.notifications.filter(n=>!n.read_at).length;
 return header('Уведомления','Новости, переносы, сообщения о заявках и напоминания о сроках.')+
 `<div class="toolbar"><span class="label-chip ${unread?'dark':'good'}">${unread?`Непрочитанных: ${unread}`:'Всё прочитано'}</span>${unread?'<button class="btn btn-light btn-tiny" id="read-notices">Отметить всё прочитанным ✓</button>':''}</div>
 <div class="stack">${data.notifications.length?data.notifications.map(n=>`<article class="notice-card ${n.read_at?'':'unread'}"><div class="notice-symbol" aria-hidden="true">${n.category==='deadline'?'◷':n.category==='schedule'?'▦':n.category==='request'?'⌁':'♢'}</div><div class="notice-body"><span class="overline">${{deadline:'НАПОМИНАНИЕ',schedule:'РАСПИСАНИЕ',request:'ОБРАЩЕНИЕ',news:'ОБЪЯВЛЕНИЕ'}[n.category]||'УВЕДОМЛЕНИЕ'}</span><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><time>${shortDate(n.created_at)}</time> · <a href="${esc(n.link)}">Открыть раздел ↗</a></div>${n.read_at?'':'<span class="label-chip good">Новое</span>'}</article>`).join(''):empty('Новых сообщений пока нет.')}</div>`;
}
function viewProfile(){if(teaching())return facultyProfile();
const u=data.user,fields=[['ФИО',u.full_name],['Факультет',u.faculty],['Направление',u.program],['Курс',`${u.course} курс`],['Группа',u.group],['Электронная почта',u.email],['Доступ','Студенческий демоаккаунт']];
 return header('Мой профиль','Данные вашего учебного аккаунта. Здесь используются только вымышленные сведения.')+
 `<section class="card"><div class="card-header"><h2>Информация о студенте</h2><span class="label-chip good">Демоаккаунт</span></div><div class="profile-grid">${fields.map(([key,value])=>`<div class="profile-item"><small>${esc(key)}</small><strong>${esc(value)}</strong></div>`).join('')}</div><div class="profile-note">Конкурсная концепция NEXUS. Не привязана к реальному вузу, не хранит настоящие оценки и не предоставляет официальные справки.</div></section>`;
}
const sButton=(key,label,cls='btn btn-primary',id='')=>`<button type="button" class="${cls}" data-svc="${esc(key)}" data-record="${esc(id)}">${esc(label)}</button>`;
function options(items,value){
 return items.map(([id,label])=>`<option value="${esc(id)}" ${id===value?'selected':''}>${esc(label)}</option>`).join('');
}
function selector(id,label,pairs,value){
 return `<label class="field"><span>${esc(label)}</span><select id="${id}">${options(pairs,value)}</select></label>`;
}
function recipientSelector(){
 return selector('service-student','Студент',directory.map(d=>[d.user.id,d.user.name+' · '+d.user.group]),staffStudent());
}
function threadBody(rows,myRole){
 if(!rows.length)return empty('Сообщений пока нет. Здесь появится переписка.');
 return `<ol class="conversation" aria-label="История переписки">${rows.map(m=>`<li class="${m.role===myRole?'mine':''}"><div><b>${esc(m.author)}</b> <time datetime="${esc(m.time)}">${esc(when(m.time))}</time></div><p>${esc(m.body)}</p></li>`).join('')}</ol>`;
}
function replyForm(id){
 return `<form class="reply-form" data-service-form="${id}"><label class="field">Сообщение<textarea name="body" required maxlength="2500" rows="2" placeholder="Напишите сообщение"></textarea></label><button class="btn btn-primary">Отправить</button></form>`;
}
function viewTeachers(){if(teaching())return facultyMessages();

 const id=data.user.id,people=teacherBook(id),chosen=people.find(p=>p.name===svc.teacher);
 const rows=chosen?orderByTime(sharedRows.filter(r=>r.kind==='teacher-message'&&r.thread===threadKey(id,chosen.name))):[];
 return header('Связь с преподавателями','Демонстрационная переписка сохраняется в этом браузере.')+
 `<div class="service-columns"><section class="card people-list"><h2>Преподаватели</h2><label class="field">Имя или дисциплина<input id="teacher-filter" type="search" placeholder="Найти преподавателя"></label>
 ${people.map(p=>`<button type="button" class="pick-row" data-svc="teacher" data-record="${esc(p.name)}" aria-pressed="${p.name===chosen?.name}"><strong>${esc(p.name)}</strong><small>${esc(p.subjects.join(' · '))}</small></button>`).join('')}
 <p id="no-teacher" hidden class="muted">Совпадений нет.</p></section>
 <section class="card" id="service-thread" tabindex="-1"><h2>${chosen?esc(chosen.name):'Переписка'}</h2>
 ${chosen?`<p class="service-caption">${esc(chosen.subjects.join(' · '))}</p>${threadBody(rows,'student')}${replyForm('teacher-reply')}`:empty('Выберите преподавателя, чтобы открыть диалог.')}</section></div>`;
}
function eventState(id){return Boolean(data.eventRegistrations?.[id]);}
function registered(){return '<span class="registered"><i aria-hidden="true"></i>Вы зарегистрированы</span>'}
function eventDate(e){return new Date(e.date+'T12:00:00+10:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',timeZone:zone});}
function ticketArt(){return '<div class="ticket-art" aria-hidden="true"><div class="ticket-paper"><i></i><div class="ticket-print">NEXUS<small>ВХОДНОЙ БИЛЕТ</small><b></b></div><div class="ticket-stub"><b></b></div></div></div>';}
function serviceSpotlight(){
 const e=campusEvents[0];return `<section class="svc-highlight"><div><span class="svc-kicker">Ближайшее мероприятие</span><h2>${esc(e.title)}</h2><p>${eventDate(e)} · ${esc(e.time)} · ${esc(e.place)}</p><a href="#events/${e.id}" class="light-cta">Открыть мероприятие →</a></div>${ticketArt()}</section>`;
}
function recentChanges(){
 const uid=data.user.id;
 const entries=data.notifications.map(n=>({title:n.title,text:n.body,time:n.created_at,link:n.link||'#notifications'}));
 for(const r of sharedRows.filter(r=>r.owner===uid)){
  if(r.kind==='journal')entries.push({title:'Запись в электронном журнале',text:r.subject+' · '+r.attendance+(r.grade?' · Оценка '+r.grade:''),time:r.time,link:'#journal'});
  if(r.kind==='support-message'&&r.role==='support')entries.push({title:'Ответ технической поддержки',text:r.body,time:r.time,link:'#support/'+r.thread});
  if(r.kind==='teacher-message'&&r.role==='teacher')entries.push({title:r.author,text:r.body,time:r.time,link:'#teachers/'+encodeURIComponent(r.teacher)});
 }
 return entries.sort((a,b)=>b.time.localeCompare(a.time)).slice(0,3);
}
function changesPanel(){
 return `<section class="card recent-changes"><div class="card-header"><h2>Последние изменения</h2><a href="#notifications" class="section-link">Уведомления →</a></div>
 ${recentChanges().map(x=>`<a class="change-line" href="${esc(x.link)}"><span><strong>${esc(x.title)}</strong><small>${esc(x.text)}</small></span><time>${esc(shortDate(x.time))}</time></a>`).join('')||empty('Новых изменений пока нет.')}</section>`;
}
function viewEvents(){
 return header('Мероприятия','Ближайшие встречи и практикумы кампуса. Даты указаны по Владивостоку.')+`<div class="service-stack">${campusEvents.map(e=>`<article class="card event-row"><time class="date-tile" datetime="${e.date}"><b>${e.date.slice(-2)}</b><small>ноября</small></time><div><h2>${esc(e.title)}</h2><p class="muted">${esc(e.time)} · ${esc(e.place)}</p>${eventState(e.id)?registered():''}</div>${sButton('event','Подробнее','btn btn-light',e.id)}</article>`).join('')}</div>`;
}
function studentJournal(){
 const uid=data.user.id,rows=new Map();
 data.lessons.filter(l=>l.weekday<=schoolToday()).forEach((lesson,index)=>{
  const id=journalKey(uid,lesson);
  rows.set(id,{id,subject:lesson.subject,date:lessonDate(lesson.weekday),begins:lesson.begins,
   teacher:lesson.teacher,...demoMark(uid,lesson)});
 });
 for(const row of sharedRows){if(row.kind==='journal'&&row.owner===uid)rows.set(row.id,row);}
 return [...rows.values()].sort((a,b)=>b.date.localeCompare(a.date)||b.begins.localeCompare(a.begins));
}
function viewJournal(){if(teaching())return facultyJournal();

 const rows=studentJournal(), subjects=[...new Set(rows.map(r=>r.subject))].sort((a,b)=>a.localeCompare(b,'ru'));
 const filter=subjects.includes(svc.journalFilter)?svc.journalFilter:'';
 const names={'Присутствовал(а)':'Посещение','Отсутствовал(а)':'Пропуск','Уважительная причина':'Пропуск по уважительной причине'};
 return header('Электронный журнал','Посещаемость и оценки за пары. Демонстрационная учебная неделя.')+
 '<div class="select-row">'+selector('journal-filter','Дисциплина',[['','Все дисциплины'],...subjects.map(s=>[s,s])],filter)+'</div>'+
 '<div class="journal-list">'+subjects.filter(s=>!filter||s===filter).map(subject=>
 `<section class="card"><h2>${esc(subject)}</h2>${rows.filter(r=>r.subject===subject).map(r=>
 `<article class="journal-entry"><div><strong>${esc(shortDate(r.date))} · ${esc(r.begins)}</strong><small>${esc(r.teacher)}</small></div><span>${esc(names[r.attendance]||r.attendance)}</span><b>${r.grade?'Оценка '+esc(r.grade):'Без оценки'}</b></article>`).join('')}</section>`).join('')+'</div>';
}
function journalKey(uid,lesson){return 'journal:'+uid+':'+lessonDate(lesson.weekday)+':'+lesson.id;}
function viewSupport(){
 const tickets=ticketsForView(),t=tickets.find(t=>t.id===svc.ticket);
 return header('Техническая поддержка','Локальные демонстрационные обращения о работе кабинета.')+
 `<div class="service-columns"><section class="card"><div class="card-header"><h2>Мои обращения</h2></div>
 ${sButton('support-new','Новое обращение','btn btn-primary btn-tiny')}
 ${tickets.map(x=>`<button type="button" class="pick-row" data-svc="case" data-record="${esc(x.id)}" aria-pressed="${x.id===t?.id}"><strong>${esc(x.title)}</strong><small>${supportState(x)}</small></button>`).join('')||empty('Обращений пока нет.')}</section>
 <section class="card" id="service-thread" tabindex="-1"><h2>${esc(t?.title||'Переписка')}</h2>${t?`<p class="service-caption">${esc(t.author)} · ${supportState(t)}</p>${threadBody(supportHistory(t),'student')}${replyForm('support-reply')}`:empty('Выберите обращение, чтобы увидеть сообщения и статус.')}</section></div>`;
}
function viewPortfolio(){
 const rows=(data.portfolio||[]).slice().sort((a,b)=>b.date.localeCompare(a.date)||b.updated.localeCompare(a.updated));
 return header('Портфолио','Проекты, достижения и учебные работы вашего профиля.')+
 (rows.length?`<div class="portfolio-toolbar">${sButton('portfolio-new','Добавить работу')}</div><div class="portfolio-grid">${rows.map(p=>`<button type="button" class="card work-thumb" data-svc="portfolio-read" data-record="${esc(p.id)}"><small>${esc(p.category)} · ${shortDate(p.date)}</small><strong>${esc(p.title)}</strong><span>${esc(p.description)}</span></button>`).join('')}</div>`:
 `<section class="card portfolio-empty"><h2>Ваши работы</h2><p>Здесь можно собрать проект, сертификат или результат учебной практики.</p>${sButton('portfolio-new','Добавить первую работу')}</section>`);
}

const pages={teachers:viewTeachers,events:viewEvents,journal:viewJournal,support:viewSupport,portfolio:viewPortfolio,overview:viewOverview,actions:viewActions,schedule:viewSchedule,grades:viewGrades,requests:viewRequests,notifications:viewNotifications,profile:viewProfile};
function render(){if(!data)return;
 if(!canVisit(routeName()))history.replaceState(null,'','#overview');
 const current=route();applyServiceRoute();
 const hasMore=!['overview','actions','schedule',teaching()?'journal':'requests'].includes(current);
 if(hasMore)$('#mobile-more').setAttribute('aria-current','page');else $('#mobile-more').removeAttribute('aria-current');document.title=`${pageLabel(current)} — NEXUS`;
 [...$$('.side-nav a'),...$$('.mobile-tabs a')].forEach(link=>link.dataset.page===current?link.setAttribute('aria-current','page'):link.removeAttribute('aria-current'));
 const open=data.actions.filter(x=>x.state==='open').length,unread=data.notifications.filter(x=>!x.read_at).length;
 const pill=$('#tasks-pill'),notices=$('#unread-pill');pill.hidden=!open;pill.textContent=open;notices.hidden=!unread;notices.textContent=unread;$('#top-unread').hidden=!unread;
 el.workspace.innerHTML=(storageMode==='temporary'?state('Сохранение в этом браузере выключено. Изменения доступны до закрытия вкладки.'): '')+pages[current]();
 if(current==='requests'&&compose){const action=compose;compose=null;
  $('#request-kind').value=action.request_kind;$('#request-title').value=action.proposed_title;$('#request-desc').value=action.proposed_text+'\n\nУчебная задача: '+action.title+(action.deadline?'. Срок: '+shortDate(action.deadline):'')+'. Группа: '+data.user.group+'.';$('#request-action').value=action.id;
  const note=$('#request-note');note.hidden=false;note.textContent='Форма заполнена по вашей учебной задаче. Проверьте текст перед отправкой.';
  $('#request-title').focus();}
}
// All user interactions share one delegated handler so navigation survives rerenders.
el.workspace.addEventListener('click',async event=>{
 if(event.target.closest('[data-schedule-week]'))period='week';
 if(event.target.closest('[data-schedule-today]')){period='day';day=schoolToday();}
 const lesson=event.target.closest('[data-lesson]');
 if(lesson){openLesson(lesson);return;}
 if(event.target.closest('[data-add-action]')){openTask();return;}
 const complete=event.target.closest('[data-complete]');
 if(complete){
  complete.disabled=true;try{await api('actions/'+complete.dataset.complete+'/complete');data=await api('dashboard');render();flashInWorkspace('Личная задача выполнена.');notice('Личная задача выполнена.');}
  catch(error){complete.disabled=false;flashInWorkspace(error.message,true);}return;
 }
 const advance=event.target.closest('[data-advance]');
 if(advance){advance.disabled=true;try{await api('requests/'+advance.dataset.advance+'/advance',{body:{from:advance.dataset.from}});data=await api('dashboard');render();document.getElementById('requests-'+advance.dataset.advance)?.focus({preventScroll:true});notice('Статус обновлён.')}catch(error){flashInWorkspace(error.message,true);advance.disabled=false}return}
 const periodBtn=event.target.closest('[data-period]');
 if(periodBtn){period=periodBtn.dataset.period;render();$(`[data-period="${period}"]`,el.workspace)?.focus();return;}
 const ack=event.target.closest('[data-ack]');
 if(ack){ack.disabled=true;try{await api(`actions/${encodeURIComponent(ack.dataset.ack)}/ack`,{method:'POST'});data=await api('dashboard');render();(document.getElementById('actions-'+ack.dataset.ack)||el.workspace).focus({preventScroll:true});notice('Изменение отмечено просмотренным.');}
  catch(error){flashInWorkspace(error.message,true);}return;}
 const composeBtn=event.target.closest('[data-compose]');
 if(composeBtn){const action=data.actions.find(a=>a.id===composeBtn.dataset.compose);if(!action)return;
  compose=action;
  if(route()==='requests')render();else location.hash='#requests';
  return;}
 const readBtn=event.target.closest('#read-notices');
 if(readBtn){readBtn.disabled=true;try{await api('notifications/read',{method:'POST'});data=await api('dashboard');render();notice('Уведомления отмечены прочитанными.');}
  catch(error){flashInWorkspace(error.message,true);}return;}
});
el.workspace.addEventListener('change',event=>{if(event.target.id==='day-select'){day=Number(event.target.value);render();$('#day-select')?.focus();}});
el.workspace.addEventListener('submit',async event=>{
 if(event.target.id!=='request-form')return;
 event.preventDefault();const form=event.target,submit=$('#request-submit');submit.disabled=true;
 const note=$('#request-note');note.hidden=false;note.textContent='Сохраняем заявку…';
 const fields=Object.fromEntries(new FormData(form));
 if(!fields.action_id)delete fields.action_id;
 try{const created=await api('requests',{method:'POST',body:fields});data=await api('dashboard');render();flashInWorkspace(`Заявка № ${created.id.slice(0,8)} отправлена. Статус: «Получено».`);notice('Заявка сохранена.');}
 catch(error){if(error.status===401)showLanding();else{note.hidden=false;note.textContent=error.message;note.classList.add('error');}}
 finally{submit.disabled=false;}
});

const serviceDialog=$('#service-dialog'), servicePanel=$('#service-panel');
let dialogMode='',dialogItem='',returnTo=null;
function showServiceDialog(title,body,mode='',id=''){
 if(!serviceDialog.open)returnTo=document.activeElement;
 dialogMode=mode;dialogItem=id;
 $('#service-error').hidden=true;$('#service-heading').textContent=title;servicePanel.innerHTML=body;
 if(!serviceDialog.open)serviceDialog.showModal();
 (servicePanel.querySelector('form input,form textarea')||$('#service-close')).focus();
}
function eventDialog(id){
 const e=campusEvents.find(event=>event.id===id);if(!e)return;
 showServiceDialog(e.title,`<p class="detail-intro">${esc(e.description)}</p><dl class="detail-rows">
 <div><dt>Когда</dt><dd>${eventDate(e)} · ${esc(e.time)}</dd></div><div><dt>Место</dt><dd>${esc(e.place)}</dd></div><div><dt>Организатор</dt><dd>${esc(e.host)}</dd></div></dl>
 <div class="dialog-actions">${eventState(id)?registered()+sButton('unregister','Отменить регистрацию','btn btn-light',id):sButton('register','Зарегистрироваться','btn btn-primary',id)}</div>`,'event',id);
}
let attachmentDraft=[], previewURLs=[];
function releasePreviews(){for(const url of previewURLs)URL.revokeObjectURL(url);previewURLs=[];}
function fileSize(n){return n<1024?n+' Б':n<1048576?Math.ceil(n/1024)+' КБ':(n/1048576).toLocaleString('ru',{maximumFractionDigits:1})+' МБ';}
function draftList(){
 const ul=$('#attachment-draft');
 if(!ul)return;
 ul.innerHTML=attachmentDraft.map(a=>`<li><span>${esc(a.name)} <small>${fileSize(a.size)}</small></span><button class="file-remove" type="button" data-remove-file="${esc(a.id)}" aria-label="Убрать файл ${esc(a.name)}">Убрать</button></li>`).join('');
}
function fileContent(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onload=()=>resolve(String(reader.result).split(',')[1]);
  reader.onerror=()=>reject(Error('Не удалось прочитать файл «'+file.name+'». Выберите его ещё раз.'));
  reader.readAsDataURL(file);
 });
}
async function readDraft(draft){
 return Promise.all(draft.map(async a=>a.file?{id:a.id,name:a.name,size:a.size,type:a.file.type,content:await fileContent(a.file)}:a));
}
serviceDialog.addEventListener('change',e=>{
 if(e.target.id!=='portfolio-files')return;
 for(const file of e.target.files)attachmentDraft.push({id:crypto.randomUUID(),name:file.name,size:file.size,file});
 e.target.value='';draftList();
});
serviceDialog.addEventListener('click',e=>{
 const button=e.target.closest('[data-remove-file]');if(!button)return;
 attachmentDraft=attachmentDraft.filter(a=>a.id!==button.dataset.removeFile);draftList();$('#portfolio-files')?.focus();
});
function fileLinks(item){
 releasePreviews();
 if(!item.attachments?.length)return '';
 return '<section class="work-files"><h3>Вложения</h3><ul>'+item.attachments.map(a=>{
  const raw=bytes(a.content), preview=/^image\/(png|jpeg|gif|webp|avif|bmp)$/i.test(a.type);
  const url=URL.createObjectURL(new Blob([raw],{type:preview?a.type:'application/octet-stream'}));
  previewURLs.push(url);
  return `<li>${preview?`<img src="${url}" alt="${esc(a.name)}">`:''}<a download="${esc(a.name)}" href="${url}">Скачать · ${esc(a.name)}</a><small>${fileSize(a.size)}</small></li>`;
 }).join('')+'</ul></section>';
}
serviceDialog.addEventListener('close',()=>{attachmentDraft=[];releasePreviews();});

function portfolioEditor(item){
 releasePreviews();attachmentDraft=[...(item?.attachments||[])];
 showServiceDialog(item?'Редактировать работу':'Новая работа',`<form data-service-form="portfolio">
 <label class="field">Название<input name="title" required maxlength="120" value="${esc(item?.title||'')}"></label>
 <div class="fields-grid"><label class="field">Категория<select name="category">${options(categories.map(x=>[x,x]),item?.category)}</select></label>
 <label class="field">Дата<input type="date" required name="date" value="${esc(item?.date||schoolDate())}"></label></div>
 <label class="field">Описание<textarea name="description" required maxlength="2500" rows="4">${esc(item?.description||'')}</textarea></label>
 <label class="field">Ссылка · необязательно<input name="link" type="url" maxlength="2000" placeholder="https://" value="${esc(item?.link||'')}"></label>
 <label class="field">Фотографии и файлы<input type="file" id="portfolio-files" multiple><small>Можно выбрать несколько файлов с устройства.</small></label><ul class="file-draft" id="attachment-draft" aria-live="polite"></ul>
 <div class="dialog-actions">${sButton('dialog-close','Отмена','btn btn-light')}<button class="btn btn-primary">Сохранить</button></div></form>`,'portfolio-edit',item?.id||'');draftList();
}
function portfolioDetail(item){
 if(!item)return;
 showServiceDialog(item.title,`<p class="service-caption">${esc(item.category)} · ${date(item.date)}</p><p class="detail-intro">${esc(item.description)}</p>
 ${fileLinks(item)}${item.link?`<a href="${esc(item.link)}" class="inline-link" target="_blank" rel="noopener noreferrer">Открыть ссылку ↗</a>`:''}
 <div class="dialog-actions">${sButton('portfolio-delete','Удалить','btn btn-light',item.id)}${sButton('portfolio-edit','Редактировать','btn btn-primary',item.id)}</div>`,'portfolio-detail',item.id);
}
function newCase(){
 showServiceDialog('Новое обращение в поддержку',`<form data-service-form="case-create">
 <label class="field">Тема<input name="title" required maxlength="120" placeholder="Что случилось?"></label>
 <label class="field">Описание проблемы<textarea name="body" required maxlength="2500" rows="4" placeholder="В каком разделе возникла проблема?"></textarea></label>
 <div class="dialog-actions">${sButton('dialog-close','Отмена','btn btn-light')}<button class="btn btn-primary">Отправить обращение</button></div></form>`,'support-new');
}
$('#service-close').addEventListener('click',()=>serviceDialog.close());
serviceDialog.addEventListener('close',()=>{
 if(dialogMode==='event'&&location.hash.startsWith('#events/'))history.replaceState(null,'','#events');
 const focus=returnTo,mode=dialogMode,id=dialogItem;
 dialogMode='';dialogItem='';returnTo=null;
 const replacement=mode==='event'?el.workspace.querySelector('[data-svc="event"][data-record="'+CSS.escape(id)+'"]'):
   mode.startsWith('portfolio')?(el.workspace.querySelector('[data-svc="portfolio-read"][data-record="'+CSS.escape(id)+'"]')||el.workspace.querySelector('[data-svc="portfolio-new"]')):el.workspace.querySelector('[data-svc="support-new"]');
 (focus?.isConnected?focus:replacement||el.workspace).focus({preventScroll:true});
});
function applyServiceRoute(){
 if(svc.lastRoute===location.hash)return;
 svc.lastRoute=location.hash;
 const part=location.hash.split('/')[1];
 if(!part)return;
 let id;try{id=decodeURIComponent(part)}catch{return}
 if(route()==='teachers'&&!teaching())svc.teacher=id;
 if(route()==='journal'&&teaching()){const lesson=data.lessons.find(l=>l.id===id);if(lesson){svc.lesson=id;svc.group=lesson.group;}}
 if(route()==='support'){svc.agent=false;svc.ticket=id;}
 if(route()==='events')requestAnimationFrame(()=>{if(data&&location.hash==='#events/'+encodeURIComponent(id))eventDialog(id);});
}
function serviceFocus(id){document.getElementById(id)?.focus({preventScroll:true});}
function serviceMessage(msg){flashInWorkspace(msg);notice(msg);}
function serviceError(err,target){
 if(serviceDialog.open){const p=$('#service-error');p.textContent=err.message;p.hidden=false;}else flashInWorkspace(err.message,true);
 if(target?.isConnected)target.disabled=false;
}
async function privateWrite(path,payload){
 const active=session;await api(path,{body:payload});if(session!==active)return false;
 const next=await api('dashboard');if(session!==active)return false;
 data=next;render();return true;
}
async function serviceClick(e){
 const b=e.target.closest('[data-svc]');if(!b||!data)return;
 const action=b.dataset.svc,id=b.dataset.record,p=(data.portfolio||[]).find(x=>x.id===id);
 try{
  switch(action){
   case 'recipient':if(teaching()&&facultyPeople().some(d=>d.user.id===id)){svc.student=id;render();serviceFocus('service-thread');}break;
   case 'teacher':svc.teacher=id;render();serviceFocus('service-thread');break;
   case 'case':svc.ticket=id;render();serviceFocus('service-thread');break;
   case 'support-new':newCase();break;
   case 'event':eventDialog(id);break;
   case 'register':case 'unregister':
    b.disabled=true;
    if(await privateWrite('services/event',{id,registered:action==='register'})){
     eventDialog(id);notice(action==='register'?'Вы зарегистрированы.':'Регистрация отменена.');
    }break;
   case 'portfolio-new':portfolioEditor();break;
   case 'portfolio-read':portfolioDetail(p);break;
   case 'portfolio-edit':if(p)portfolioEditor(p);break;
   case 'portfolio-delete':
    if(p)showServiceDialog('Удалить работу?',`<p>Работа «${esc(p.title)}» будет удалена из вашего портфолио.</p><div class="dialog-actions">${sButton('portfolio-read','Отмена','btn btn-light',id)}${sButton('portfolio-confirm','Удалить работу','btn btn-primary',id)}</div>`,'portfolio-delete',id);break;
   case 'portfolio-confirm':
    b.disabled=true;if(await privateWrite('services/portfolio/remove',{id})){serviceDialog.close();serviceMessage('Работа удалена.');}break;
   case 'dialog-close':serviceDialog.close();break;
  }
 }catch(err){serviceError(err,b);}
}
el.workspace.addEventListener('click',serviceClick);
serviceDialog.addEventListener('click',serviceClick);
async function serviceSubmit(e){
 const form=e.target.closest('[data-service-form]');if(!form||!data)return;
 e.preventDefault();if(!form.reportValidity())return;
 const submit=form.querySelector('button:not([type="button"])');if(submit.disabled)return;submit.disabled=true;
 const fields=Object.fromEntries(new FormData(form)),type=form.dataset.serviceForm,owner=data.user.id;
 const active=session,now=new Date().toISOString();
 try{
  if(type==='faculty-journal'||type==='faculty-message'){await facultySubmit(type,fields,active);return;}
  if(type==='portfolio'){
   const id=dialogItem, old=data.portfolio?.find(p=>p.id===id)?.attachments||[];
   const removed=old.filter(a=>!attachmentDraft.some(kept=>kept.id===a.id)).map(a=>a.id);
   const additions=await readDraft(attachmentDraft.filter(a=>a.file));
   if(!form.isConnected||!serviceDialog.open||session!==active)return;
   if(await privateWrite('services/portfolio/save',{...fields,id,removed,additions})){serviceDialog.close();serviceMessage('Работа сохранена.');}
   return;
  }
  let record;
  {
   const body=requiredText(fields.body,2500,'Сообщение');
   record={id:crypto.randomUUID(),owner,body,author:data.user.name,role:'student',time:now};
   if(type==='teacher-reply'){
    if(teaching())throw Error('Используйте переписку своего аккаунта.');
    const uid=data.user.id,teacher=teacherBook(uid).find(p=>p.name===svc.teacher);
    if(!teacher)throw Error('Выберите преподавателя.');
    Object.assign(record,{kind:'teacher-message',owner:uid,teacher:teacher.name,thread:threadKey(uid,teacher.name),role:'student',author:data.user.name});
   }else if(type==='case-create'){
    Object.assign(record,{kind:'case',title:requiredText(fields.title,120,'Тема')});
   }else if(type==='support-reply'){
    const t=ticketsForView().find(x=>x.id===svc.ticket);if(!t)throw Error('Откройте обращение.');
    Object.assign(record,{kind:'support-message',owner:t.owner,thread:t.id,role:'student',author:data.user.name});
   }else throw Error('Форма не найдена.');
  }
  await storeShared(record);if(session!==active)return;
  if(type==='case-create'){svc.ticket=record.id;serviceDialog.close();}
  render();
  const history=$('.conversation',el.workspace);if(history)history.scrollTop=history.scrollHeight;
  $('.reply-form textarea',el.workspace)?.focus({preventScroll:true});notice('Сообщение сохранено.');
 }catch(err){serviceError(err,submit);}finally{if(submit.isConnected)submit.disabled=false;}
}
el.workspace.addEventListener('submit',serviceSubmit);serviceDialog.addEventListener('submit',serviceSubmit);
el.workspace.addEventListener('change',e=>{
 const input=e.target;
 if(input.id==='journal-filter')svc.journalFilter=input.value;
 else if(input.id==='faculty-group'&&teaching()){svc.group=input.value;svc.lesson='';history.replaceState(null,'','#journal');}
 else if(input.id==='faculty-pair'&&teaching()){svc.lesson=input.value;history.replaceState(null,'',itemUrl('journal',input.value));}
 else return;
 render();serviceFocus(input.id);
});
el.workspace.addEventListener('input',e=>{
 if(e.target.id!=='teacher-filter')return;
 const q=e.target.value.toLocaleLowerCase('ru').trim();
 const buttons=$$('[data-svc="teacher"]',el.workspace);
 buttons.forEach(b=>b.hidden=!b.textContent.toLocaleLowerCase('ru').includes(q));$('#no-teacher').hidden=buttons.some(b=>!b.hidden);
});
const moreToggle=$('#mobile-more');
moreToggle.addEventListener('click',()=>{
 if(!el.mobileSheet.hidden)el.mobileSheet.querySelector('a')?.focus({preventScroll:true});
});
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape'||el.mobileSheet.hidden)return;
 event.preventDefault();
 el.mobileSheet.hidden=true;
 moreToggle.setAttribute('aria-expanded','false');
 moreToggle.focus();
});

const finder=$('#finder'), searchInput=$('#find-input'), results=$('#find-results');
function showResults() {
 const query=searchInput.value.trim().toLocaleLowerCase('ru').replaceAll('ё','е');
 const aliases={actions:'мои действия задачи список',teachers:'связь преподаватель чат сообщения',events:'мероприятия события регистрация',journal:'электронный журнал посещаемость оценки',support:'техническая поддержка помощь чат',portfolio:'портфолио проекты сертификаты достижения',grades:'оценки сессия',requests:'заявки справки',overview:'главная'};
 const entries=[
  ...Object.keys(labels).filter(canVisit).map(page=>({title:pageLabel(page),url:'#'+page,type:'Раздел',keywords:aliases[page]||''})),
  ...data.actions.map(a=>({title:a.title,url:itemUrl('actions',a.id),type:'Задача',keywords:''}))
 ].filter(r=>query.split(/\s+/).every(word=>(r.title+' '+r.keywords).toLocaleLowerCase('ru').replaceAll('ё','е').includes(word)));
 results.innerHTML=entries.map(r=>`<a href="${esc(r.url)}"><span>${esc(r.title)}</span><small>${r.type}</small></a>`).join('') || empty('Ничего не найдено. Попробуйте часть названия.');
 $('#find-count').textContent='Результатов: '+entries.length;
}
function openFinder(){
 if(!data || finder.open)return;
 searchInput.value='';showResults();finder.showModal();searchInput.focus();
}
$('#find-open').addEventListener('click',openFinder);
$('#find-close').addEventListener('click',()=>finder.close());
searchInput.addEventListener('input',showResults);
results.addEventListener('click',event=>{
 const link=event.target.closest('a');
 if(!link)return;
 finder.close();
 if(link.hash===location.hash){event.preventDefault();if(!focusRouteItem())el.workspace.focus();}
});
finder.addEventListener('keydown',event=>{
 const links=$$('a',results);
 if(event.key==='Enter' && document.activeElement===searchInput){
  event.preventDefault();links[0]?.click();return;
 }
 if(!['ArrowDown','ArrowUp'].includes(event.key)||!links.length)return;
 event.preventDefault();
 const index=links.indexOf(document.activeElement);
 if(event.key==='ArrowUp' && index===0){searchInput.focus();return;}
 links[event.key==='ArrowDown'?(index+1)%links.length:index<0?links.length-1:index-1].focus();
});
document.addEventListener('keydown',event=>{
 if(data && (event.ctrlKey||event.metaKey) && event.key.toLowerCase()==='k'){event.preventDefault();openFinder();}
});


document.querySelector('#storage-help').addEventListener('click',()=>document.querySelector('#storage-info').showModal());
window.addEventListener('scroll',()=>document.querySelector('#nav').classList.toggle('scrolled',window.scrollY>50),{passive:true});
const seaFrame=$('.photo-plane'),seaViewport=$('.ocean'),mobileSea=matchMedia('(max-width:760px)');
function fitPanorama(){
 const ratio=mobileSea.matches?941/1672:1918/820;
 const width=Math.max(seaViewport.clientWidth,seaViewport.clientHeight*ratio);
 if(width)seaFrame.style.width=width+'px';
}
new ResizeObserver(fitPanorama).observe(seaViewport);mobileSea.addEventListener('change',fitPanorama);fitPanorama();
(function animateSea(){
 const water=document.querySelector('.bay-water'),photo=document.querySelector('#campus-photo');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const canvas=document.createElement('canvas');
 canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='display:block;width:100%;height:100%;pointer-events:none';
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:false});
 function softwareWaves(){
  const surface=document.createElement('canvas'),ctx=surface.getContext('2d',{alpha:false});
  if(!ctx)return;
  surface.style.cssText='display:block;width:100%;height:100%;pointer-events:none';
  const sine=Float32Array.from({length:2048},(_,i)=>Math.sin(i*Math.PI/1024));
  let input,output,phaseA,phaseB,depth,signature='',timer=0,t=0,last=0;
  function paint(){
   const natural=photo.naturalWidth,fullHeight=photo.naturalHeight;
   if(!natural||!photo.complete)return;
   const w=Math.min(1024,natural,Math.ceil(water.clientWidth*Math.min(devicePixelRatio,1.4)));
   if(w<2)return;
   const shore=natural>fullHeight?335:709,h=Math.max(2,Math.round((fullHeight-shore)*w/natural));
   if(signature!==natural+'/'+w){
    surface.width=w;surface.height=h;ctx.drawImage(photo,0,shore,natural,fullHeight-shore,0,0,w,h);
    input=ctx.getImageData(0,0,w,h).data;output=ctx.createImageData(w,h);
    phaseA=new Uint16Array(w*h);phaseB=new Uint16Array(w*h);depth=new Float32Array(h);
    for(let y=0;y<h;y++){
     const d=y/(h-1),z=Math.log1p(8*d);depth[y]=Math.pow(d,1.18)*w/natural;
     for(let x=0;x<w;x++){
      const i=y*w+x,p=x*natural/w*.006;
      phaseA[i]=326*(6.7*z+1.3*p+.65*Math.sin(.7*p));
      phaseB[i]=326*(11*z-2.2*p+.8*Math.sin(2*z+p));
     }
    }
    signature=natural+'/'+w;
   }
   const now=performance.now();t+=last?Math.min(now-last,100)*.001:0;last=now;
   const u=Math.round(-303*t),v=Math.round(404*t),dst=output.data;
   for(let y=0;y<h;y++){
    const k=depth[y];
    for(let x=0;x<w;x++){
     const i=y*w+x,a=phaseA[i]+u,b=sine[(phaseB[i]+v)&2047],c=sine[a&2047];
     const sx=Math.min(w-1.001,Math.max(0,x+k*(5.8*c+3.1*b)));
     const sy=Math.min(h-1.001,Math.max(0,y+k*(3.8*sine[(a+512)&2047]+2.2*b)));
     const ix=sx|0,iy=sy|0,fx=sx-ix,fy=sy-iy,j=(iy*w+ix)*4,j2=j+w*4;
     const shine=1+k*.032*(c+.5*b)*Math.min(1,Math.max(0,(input[j]-input[j2])/20));
     for(let n=0;n<3;n++){
      const upper=input[j+n]+(input[j+n+4]-input[j+n])*fx;
      const lower=input[j2+n]+(input[j2+n+4]-input[j2+n])*fx;
      dst[i*4+n]=(upper+(lower-upper)*fy)*shine;
     }
     dst[i*4+3]=255;
    }
   }
   ctx.putImageData(output,0,0);if(!surface.isConnected)water.append(surface);
  }
  function tick(){timer=0;
   const box=water.getBoundingClientRect();
   if(reduced.matches||document.hidden||!box.width||box.top>=innerHeight||box.bottom<=0){last=0;return;}
   paint();timer=setTimeout(tick,40);
  }
  function sync(){clearTimeout(timer);if(reduced.matches)surface.remove();tick();}
  new IntersectionObserver(sync).observe(water);
  reduced.addEventListener('change',sync);photo.addEventListener('load',sync);document.addEventListener('visibilitychange',sync);sync();
 }

 if(!gl){softwareWaves();return;}
 function shader(kind,src){
  const s=gl.createShader(kind);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('shader');
  return s;
 }
 const program=gl.createProgram();
 try{
 gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 a;varying vec2 uv;void main(){uv=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}'));
 gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision highp float;
 varying vec2 uv;uniform sampler2D sea;uniform vec2 px;uniform float top,t;
 void main(){
 float d=uv.y;vec2 p=vec2(uv.x,mix(top,1.,d));
 float z=log(1.+8.*d),x=p.x/px.x*.006;
 float swell=sin(6.7*z+1.3*x+.65*sin(.7*x)-t*.93);
 float drift=sin(11.*z-2.2*x+.8*sin(2.*z+x)+1.24*t);
 float ripple=sin(25.*z+3.1*x+.7*swell-1.93*t);
 float strength=smoothstep(.0,.18,d)*pow(d,.82);
 vec2 flow=vec2(5.7*swell+2.6*drift+1.1*ripple,3.6*cos(6.7*z+1.3*x+.65*sin(.7*x)-t*.93)+2.1*drift+.8*ripple);
 vec2 q=clamp(p+px*strength*flow,px*.5,1.-px*.5);
 vec3 c=texture2D(sea,q).rgb;
 vec3 avg=.5*(texture2D(sea,q+vec2(0.,3.*px.y)).rgb+texture2D(sea,q-vec2(0.,3.*px.y)).rgb);
 float crest=smoothstep(.005,.14,dot(c-avg,vec3(.22,.68,.1)));
 gl_FragColor=vec4(c+strength*crest*(.035*swell+.025*ripple)*vec3(1.,.96,.88),1.);
 }`));
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error();
 }catch{softwareWaves();return;}
 gl.useProgram(program);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
 for(const k of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE);
 for(const k of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR);
 const loc=k=>gl.getUniformLocation(program,k),top=loc('top'),px=loc('px'),t=loc('t');
 let running=0,visible=false,source='',elapsed=0,last=0;
 function frame(now){
  running=0;if(!visible||document.hidden||reduced.matches||gl.isContextLost())return;
  if(!photo.complete||!photo.naturalWidth){running=requestAnimationFrame(frame);return;}
  const w=photo.naturalWidth,h=photo.naturalHeight;
  if(source!==photo.currentSrc){
   try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photo);}catch{return;}
   gl.uniform2f(px,1/w,1/h);gl.uniform1f(top,w>h?335/820:709/1672);source=photo.currentSrc;
  }
  const width=Math.min(w,Math.ceil(water.clientWidth*Math.min(devicePixelRatio,2))),height=Math.max(1,Math.round(width*water.clientHeight/Math.max(1,water.clientWidth)));
  if(width&&canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,canvas.width,canvas.height);}
  elapsed+=last?Math.min(now-last,80)/1000:0;last=now;gl.uniform1f(t,elapsed);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  if(!canvas.isConnected){water.append(canvas);water.style.backgroundImage='none';}
  running=requestAnimationFrame(frame);
 }
 function sync(){cancelAnimationFrame(running);last=0;if(reduced.matches||gl.isContextLost()){canvas.remove();water.style.removeProperty('background-image');}if(visible&&!document.hidden&&!reduced.matches&&!gl.isContextLost())running=requestAnimationFrame(frame);}
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();}).observe(document.querySelector('.land-hero'));
 reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);canvas.addEventListener('webglcontextlost',()=>{sync();softwareWaves();},{once:true});
})();

const togglePass=document.getElementById('toggle-password');
togglePass.addEventListener('click',()=>{
 const input=document.getElementById('login-password');
 const show=input.type==='password';
 input.type=show?'text':'password';
 togglePass.textContent=show?'🙈':'👁';
 togglePass.setAttribute('aria-label',show?'Скрыть пароль':'Показать пароль');
 togglePass.setAttribute('aria-pressed',String(show));
});
el.dialog.addEventListener('close',()=>{
 $('#login-password').type='password';togglePass.textContent='👁';
 togglePass.setAttribute('aria-label','Показать пароль');togglePass.setAttribute('aria-pressed','false');
});
