var _0xf59c = ["\x69\x6E\x69\x74\x69\x61\x6C\x69\x7A\x65\x41\x70\x70", "\x72\x65\x61\x64\x79", "", "\x41", "\x41\x49\x7A\x61\x53\x79\x43\x59\x75\x75\x51\x4D\x38\x76\x51\x75\x73\x32\x39\x4A\x73\x71\x32\x7A\x39\x5A\x66\x54\x69\x6A\x62\x6C\x52\x33\x38\x49\x31\x33\x63", "\x68\x6F\x74\x77\x69\x6E\x67\x73\x63\x74\x67\x2E\x63\x6F\x6D", "\x68\x6F\x74\x77\x69\x6E\x67\x73\x63\x61\x72\x74\x61\x67\x65\x6E\x61", "\x68\x6F\x74\x77\x69\x6E\x67\x73\x63\x61\x72\x74\x61\x67\x65\x6E\x61\x2E\x61\x70\x70\x73\x70\x6F\x74\x2E\x63\x6F\x6D", "\x31\x30\x34\x32\x39\x33\x30\x39\x38\x39\x36\x36\x36", "\x31\x3A\x31\x30\x34\x32\x39\x33\x30\x39\x38\x39\x36\x36\x36\x3A\x77\x65\x62\x3A\x37\x61\x64\x34\x36\x62\x33\x39\x30\x64\x37\x39\x39\x38\x66\x61\x30\x38\x61\x66\x33\x62", "\x47\x2D\x39\x43\x59\x53\x32\x4C\x46\x54\x37\x43", "\x66\x69\x72\x65\x73\x74\x6F\x72\x65", "\x67\x65\x74", "\x64\x6F\x63", "\x63\x61\x74\x65\x67\x6F\x72\x69\x65\x73", "\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E", "\x64\x61\x74\x61", "\x69\x64", "\x6E\x61\x6D\x65", "\x6F\x72\x64\x65\x72", "\x73\x74\x61\x74\x75\x73", "\x6D\x65\x6E\x75\x4F\x70\x74\x69\x6F\x6E\x73", "\x6C\x6F\x63\x61\x6C\x65\x43\x6F\x6D\x70\x61\x72\x65", "\x63\x61\x74\x65\x67\x6F\x72\x79\x49\x64", "\x4F\x70\x74\x69\x6F\x6E\x73\x4F\x6E\x49\x74\x65\x6D\x49\x6E\x43\x61\x72\x74", "\x6F\x70\x74\x69\x6F\x6E\x49\x74\x65\x6D\x73", "\x66\x69\x65\x6C\x64\x54\x79\x70\x65", "\x6D\x65\x6E\x75\x4F\x70\x74\x69\x6F\x6E\x4F\x6E\x49\x74\x65\x6D\x49\x6E\x43\x61\x72\x49\x64", "\x70\x75\x73\x68", "\x66\x6F\x72\x45\x61\x63\x68", "\x6F\x6E\x53\x6E\x61\x70\x73\x68\x6F\x74", "\x3D\x3D", "\x77\x68\x65\x72\x65", "\x4F\x70\x74\x69\x6F\x6E\x4F\x6E\x49\x74\x65\x6D\x49\x6E\x43\x61\x72", "\x6D\x65\x6E\x75\x4F\x70\x74\x69\x6F\x6E\x4F\x6E\x49\x74\x65\x6D\x49\x6E\x43\x61\x72", "\x6F\x72\x64\x65\x72\x42\x79", "\x61\x64\x69\x74\x69\x6F\x6E\x61\x6C\x73", "\x6F\x70\x74\x69\x6F\x6E\x4F\x6E\x49\x74\x65\x6D\x49\x6E\x43\x61\x72", "\x64\x6F\x63\x73", "\x74\x68\x65\x20\x6C\x6F\x67", "\x6C\x6F\x67", "\x3D\x3E", "\x63\x6F\x64\x65", "\x6D\x65\x73\x73\x61\x67\x65", "\x63\x61\x74\x63\x68", "\x75\x73\x65\x72", "\x74\x68\x65\x6E", "\x63\x72\x65\x61\x74\x65\x55\x73\x65\x72\x57\x69\x74\x68\x45\x6D\x61\x69\x6C\x41\x6E\x64\x50\x61\x73\x73\x77\x6F\x72\x64", "\x61\x75\x74\x68", "\x73\x69\x67\x6E\x49\x6E\x57\x69\x74\x68\x45\x6D\x61\x69\x6C\x41\x6E\x64\x50\x61\x73\x73\x77\x6F\x72\x64", "\x6E\x65\x69\x67\x68\x62\x6F\x72\x68\x6F\x6F\x64\x73"];
$(document)[_0xf59c[1]](function() { firebase[_0xf59c[0]](firebaseConfig) });
const category = { id: _0xf59c[2], name: _0xf59c[2], order: 0, status: _0xf59c[3] };
const firebaseConfig = { apiKey: _0xf59c[4], authDomain: _0xf59c[5], projectId: _0xf59c[6], storageBucket: _0xf59c[7], messagingSenderId: _0xf59c[8], appId: _0xf59c[9], measurementId: _0xf59c[10] };
async function getItemBycategoryId(_0xd752x4) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    const _0xd752x6 = await _0xd752x5[_0xf59c[15]](_0xf59c[14])[_0xf59c[13]](_0xd752x4)[_0xf59c[12]]();
    return new Promise((_0xd752x7) => {
        const category = _0xd752x6[_0xf59c[16]]();
        var _0xd752x8 = { id: _0xd752x6[_0xf59c[17]], name: category[_0xf59c[18]], order: category[_0xf59c[19]], status: category[_0xf59c[20]], menuOptions: [] };
        category[_0xf59c[17]] = _0xd752x6[_0xf59c[17]];
        category[_0xf59c[21]] = [];
        if (category[_0xf59c[20]][_0xf59c[22]](_0xf59c[3]) == 0) {
            _0xd752x5[_0xf59c[15]](_0xf59c[34])[_0xf59c[32]](_0xf59c[23], _0xf59c[31], category[_0xf59c[17]].toString())[_0xf59c[30]](function(_0xd752x9) {
                _0xd752x9[_0xf59c[29]](function(_0xd752xa) {
                    let _0xd752xb = _0xd752xa[_0xf59c[16]]();
                    let _0xd752xc = {};
                    _0xd752xc[_0xf59c[17]] = _0xd752xa[_0xf59c[17]];
                    _0xd752xc[_0xf59c[23]] = _0xd752xb[_0xf59c[23]];
                    _0xd752xc[_0xf59c[18]] = _0xd752xb[_0xf59c[18]];
                    _0xd752xc[_0xf59c[19]] = _0xd752xb[_0xf59c[19]];
                    _0xd752xc[_0xf59c[24]] = _0xd752xb[_0xf59c[24]];
                    _0xd752xc[_0xf59c[25]] = [];
                    _0xd752x5[_0xf59c[15]](_0xf59c[33])[_0xf59c[32]](_0xf59c[27], _0xf59c[31], _0xd752xa[_0xf59c[17]].toString())[_0xf59c[30]](function(_0xd752xd) {
                        _0xd752xd[_0xf59c[29]](function(_0xd752xe) {
                            let _0xd752xf = _0xd752xe[_0xf59c[16]]();
                            let _0xd752x10 = {};
                            _0xd752x10[_0xf59c[17]] = _0xd752xe[_0xf59c[17]];
                            _0xd752x10[_0xf59c[26]] = _0xd752xf[_0xf59c[26]];
                            _0xd752x10[_0xf59c[18]] = _0xd752xf[_0xf59c[18]];
                            _0xd752x10[_0xf59c[27]] = _0xd752xf[_0xf59c[27]];
                            _0xd752x10[_0xf59c[19]] = _0xd752xf[_0xf59c[19]];
                            _0xd752xc[_0xf59c[25]][_0xf59c[28]](_0xd752x10)
                        })
                    });
                    _0xd752x8[_0xf59c[21]][_0xf59c[28]](_0xd752xc)
                })
            });
            _0xd752x7(_0xd752x8)
        } else { _0xd752x7(null) }
    })
}
async function getCategorieById(_0xd752x4, _0xd752x12) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    const _0xd752x6 = await _0xd752x5[_0xf59c[15]](_0xf59c[14])[_0xf59c[13]](_0xd752x4)[_0xf59c[12]]();
    _0xd752x12(_0xd752x6)
}
async function getMenuOptionByCategoryId(category, _0xd752x12, _0xd752x14) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    _0xd752x5[_0xf59c[15]](_0xf59c[34])[_0xf59c[35]](_0xf59c[19])[_0xf59c[30]](function(_0xd752x9) { _0xd752x12(_0xd752x9, category, _0xd752x14) })
}
async function getMenuOptionOnItemByMenuId(_0xd752xc, _0xd752x16, category, _0xd752x12, _0xd752x14) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    await _0xd752x5[_0xf59c[15]](_0xf59c[33])[_0xf59c[35]](_0xf59c[19])[_0xf59c[30]](function(_0xd752x9) { var _0xd752x17 = _0xd752x12(_0xd752x9, _0xd752xc, _0xd752x16, category, _0xd752x14) });
    return category
}
async function getAditionalById(_0xd752x19, _0xd752x1a) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    const _0xd752x6 = await _0xd752x5[_0xf59c[15]](_0xf59c[36])[_0xf59c[13]](_0xd752x19)[_0xf59c[12]]();
    _0xd752x1a(_0xd752x6)
}
async function getItemsMenuByMenuOptionId(_0xd752x1c) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    let _0xd752x1d = _0xd752x5[_0xf59c[15]](_0xf59c[37])[_0xf59c[32]](_0xf59c[27], _0xf59c[31], _0xd752x1c);
    let _0xd752x1e = await _0xd752x1d[_0xf59c[12]]();
    for (const _0xd752xa of _0xd752x1e[_0xf59c[38]]) {
        console[_0xf59c[40]](_0xf59c[39]);
        console[_0xf59c[40]](_0xd752xa[_0xf59c[17]], _0xf59c[41], _0xd752xa[_0xf59c[16]]())
    }
}

function createUserWitEmailAndPassword(_0xd752x20, _0xd752x21, _0xd752x22, _0xd752x23) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    firebase[_0xf59c[48]]()[_0xf59c[47]](_0xd752x20, _0xd752x21)[_0xf59c[46]]((_0xd752x27) => {
        var _0xd752x28 = _0xd752x27[_0xf59c[45]];
        _0xd752x22(_0xd752x28)
    })[_0xf59c[44]]((_0xd752x24) => {
        var _0xd752x25 = _0xd752x24[_0xf59c[42]];
        var _0xd752x26 = _0xd752x24[_0xf59c[43]];
        _0xd752x23(_0xd752x25, _0xd752x26)
    })
}

function loginWithEmail(_0xd752x20, _0xd752x21, _0xd752x22, _0xd752x23) {
    firebase[_0xf59c[48]]()[_0xf59c[49]](_0xd752x20, _0xd752x21)[_0xf59c[46]](function() { _0xd752x22() })[_0xf59c[44]](function(_0xd752x24) {
        var _0xd752x25 = _0xd752x24[_0xf59c[42]];
        var _0xd752x26 = _0xd752x24[_0xf59c[43]];
        _0xd752x23(_0xd752x25, _0xd752x26)
    })
}

function getAllNeighborhoods(_0xd752x12) {
    var _0xd752x5 = firebase[_0xf59c[11]]();
    _0xd752x5[_0xf59c[15]](_0xf59c[50])[_0xf59c[35]](_0xf59c[18])[_0xf59c[12]]()[_0xf59c[46]]((_0xd752x9) => { _0xd752x12(_0xd752x9) })
}