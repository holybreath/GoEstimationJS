function Estimation()
{
    var adjacentdic = {a:['b'],b:['a','c'],c:['b','d'],d:['c','e'],e:['d','f'],f:['e','g'],g:['f','h'],h:['g','i'],i:['h','j'],j:['i','k'],k:['j','l'],l:['k','m'],m:['l','n'],n:['m','o'],o:['n','p'],p:['o','q'],q:['p','r'],r:['q','s'],s:['r']};
    var arounddic = {a:['-','-','a','b','c'],b:['-','a','b','c','d'],c:['a','b','c','d','e'],d:['b','c','d','e','f'],e:['c','d','e','f','g'],f:['d','e','f','g','h'],g:['e','f','g','h','i'],h:['f','g','h','i','j'],i:['g','h','i','j','k'],j:['h','i','j','k','l'],k:['i','j','k','l','m'],l:['j','k','l','m','n'],m:['k','l','m','n','o'],n:['l','m','n','o','p'],o:['m','n','o','p','q'],p:['n','o','p','q','r'],q:['o','p','q','r','s'],r:['p','q','r','s','-'],s:['q','r','s','-','-']};
    var poslist = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s'];
    var cartesiandic = {'a':-9,'b':-8,'c':-7,'d':-6,'e':-5,'f':-4,'g':-3,'h':-2,'i':-1,'j':0,'k':1,'l':2,'m':3,'n':4,'o':5,'p':6,'q':7,'r':8,'s':9};
    var aa = 'a'.charCodeAt(0);
    var x0 = 22;
    var y0 = 22;
    var adconnectregs = [
        [/......YX...XY............/,[6,12]], // jian
        [/...........XY...YX......./,[12,16]],
        [/.......XY...YX.........../,[8,12]],
        [/............YX...XY....../,[12,18]],
        [/......Y....XY...Y......../,[6,12,16]],// hu kou
        [/......YXY...Y............/,[6,8,12]],
        [/........Y...YX....Y....../,[8,12,18]],
        [/............Y...YXY....../,[12,16,18]],
        [/.Y....XX....Y............/,[1,6,7,12]],// xiao fei
        [/...Y...XX...Y............/,[3,7,8,12]],
        [/........XY..YX.........../,[8,9,12,13]],
        [/............YX....XY...../,[12,13,18,19]],
        [/............Y....XX....Y./,[12,17,18,23]],
        [/............Y...XX...Y.../,[12,16,17,21]],
        [/...........XY..YX......../,[11,12,15,16]],
        [/.....YX....XY............/,[5,6,11,12]],
        [/......X...YXY...X......../,[10,11,12]],//guan 
        [/............Y...XXX...Y../,[12,17,22]],
        [/........X...YXY...X....../,[12,13,14]],
        [/..Y...XXX...Y............/,[2,7,12]],
        [/...........YY...XX...YY../,[11,12,16,17,21,22]],// shuang
        [/............YXY..YXY...../,[12,13,14,17,18,19]],
        [/..YY...XX...YY.........../,[2,3,7,8,12,13]],
        [/.....YXY..YXY............/,[5,6,7,10,11,12]],
        [/......Y...Y.Y...Y......../,[6,10,12,16]],// hua
        [/.....OY...O.Y..O........./,[6,12]],//1 lu du guo
        [/.....O....O.Y..OY......../,[12,16]],
        [/.OOO..Y.....Y............/,[6,12]],
        [/.OOO....Y...Y............/,[8,12]],
        [/........YO..Y.O....O...../,[8,12]],
        [/.........O..Y.O...YO...../,[12,18]],
        [/............Y...Y....OOO./,[12,16]],
        [/............Y.....Y..OOO./,[12,18]]
    ];
    /* special for x or y == 7 */
    var adconnectregs_7x = [
        [/......YX....Y............/,[6,12]],
        [/.......XY...Y............/,[8,12]]
    ];
    var adconnectregs7x = [
        [/............Y...YX......./,[12,16]],
        [/............Y....XY....../,[12,18]]
    ];
    var adconnectregs_7y = [
        [/......Y....XY............/,[6,12]],
        [/...........XY...Y......../,[12,16]]
    ];
    var adconnectregs7y = [
        [/........Y...YX.........../,[8,12]],
        [/............YX....Y....../,[12,18]]
    ];
    var stonew = [];
    var stoneb = [];
    var stoneo = [];
    var stonex = [];
    var stonei = [];
    var sconw = [];// simple connected
    var sconb = [];
    var sconwdic = [];
    var sconbdic = [];
    var adsconw = [];// advanced connected
    var adsconb = [];
    var adsconwdic = {};
    var adsconbdic = {};
    var assiststonew = [];// added with assist fake stones
    var assiststoneb = [];
    var fakestonew = [];//  assist fake stones
    var fakestoneb = [];
    var deadStonew = [];
    var deadStoneb = [];
    var assumeDeadStonew = [];
    var assumeDeadStoneb = [];
    var spacegroups= [];
    var spacegroupsdic= {};
    var spacegroupsw= [];
    var spacegroupsb= [];
    var spacegroupsPublic= [];
    var breathwdic= {};
    var breathbdic= {};
    var potentialsb = [];
    var potentialsw = [];

    this.scoreBlack = 0;
    this.scoreWhite = 0;
    this.assumeDeadBlack = [];
    this.assumeDeadWhite = [];
    this.spaceBlack = [];
    this.spaceWhite = [];
    this.stableSpaceBlack = [];
    this.stableSpaceWhite = [];
    this.potentialSpaceBlack = [];
    this.potentialSpaceWhite = [];
    this.groupsBlack = [];
    this.groupsWhite = [];

    this.estimate = function (stoneblack,stonewhite,deadblacks,deadwhites)
    {
        deadblacks = deadblacks || 0;
        deadwhites = deadwhites || 0;
        stoneb = stoneblack;
        stonew = stonewhite;
        potentialsb = [];
        potentialsw = [];
        fakestoneb = [];
        fakestonew = [];
        checkConnect();
        checkSpace(assiststoneb,assiststonew);
        //checkSpace(stoneb,stonew);
        var tempdeadb = [];
        var tempdeadw = [];
        for ( var i = 0; i < adsconb.length; i++ ) {
            var alive = assumeDeadAdvance(adsconb[i],spacegroupsb,'b');
            if (!alive)
            {
                tempdeadb = tempdeadb.concat(adsconb[i]);
                assumeDeadStoneb = assumeDeadStoneb.concat(minusGroup(adsconb[i], fakestoneb));
            }
        }
        for ( var i = 0; i < adsconw.length; i++ ) {
            var alive = assumeDeadAdvance(adsconw[i],spacegroupsw,'w');
            if (!alive)
            {
                tempdeadw = tempdeadw.concat(adsconw[i]);
                assumeDeadStonew = assumeDeadStonew.concat(minusGroup(adsconw[i], fakestonew));
            }
        }
        assiststoneb  = minusGroup(assiststoneb,tempdeadb);
        assiststonew  = minusGroup(assiststonew,tempdeadw);
        checkSpace(assiststoneb,assiststonew);
        var alivebs = minusGroup(assiststoneb,fakestoneb);
        var alivews = minusGroup(assiststonew,fakestonew);
        var spaces = findAllSpaces(alivebs,alivews);
        spaces = minusGroup(spaces,spacesb);
        spaces = minusGroup(spaces,spacesw);
        for ( var i = 0; i < spaces.length; i++ ) {
            var s = spaces[i];
            var t = checkTerritory(s,alivebs,alivews);
            if (t=='b')
                potentialsb.push(s);
            if (t=='w')
                potentialsw.push(s);
        }
        var spaceb = [];
        var spacew = [];
        if (spacegroupsb.length>0  )
            spaceb = Array.prototype.concat.apply([],spacegroupsb);
        if (spacegroupsw.length>0  )
            spacew = Array.prototype.concat.apply([],spacegroupsw);
        this.stableSpaceBlack = spaceb.concat();
        this.stableSpaceWhite = spacew.concat();
        this.potentialSpaceBlack = potentialsb;
        this.potentialSpaceWhite = potentialsw;
        spaceb = spaceb.concat(potentialsb);
        spacew = spacew.concat(potentialsw);
        this.spaceBlack = spaceb;
        this.spaceWhite= spacew;
        this.groupsBlack = adsconb;
        this.groupsWhite = adsconw;
        this.assumeDeadBlack = assumeDeadStoneb;
        this.assumeDeadWhite = assumeDeadStonew;
        this.scoreBlack = spaceb.length+deadwhites;
        this.scoreWhite = spacew.length+deadblacks;
    }
    
    this.checkDead = function (tempStoneb,tempStonew,newxy)
    {
        newxy = newxy || '';
        var r = simpleConnect(tempStoneb,'b',tempStonew,tempStoneb);
        var tempSconb = r[0];
        r = simpleConnect(tempStonew,'w',tempStonew,tempStoneb);
        var tempSconw = r[0];
        var rb = [];
        var rw = [];
        for( var i9=0; i9<tempSconb.length; i9++)
        {
            var s=tempSconb[i9];
            if (s.indexOf(newxy)>-1) continue;
            if ( countBreath(s,tempStoneb,tempStonew).length == 0) 
            {
                rb = rb.concat(s);
            }
        }
        for( var i11=0; i11<tempSconw.length; i11++)
        {
            var s=tempSconw[i11];
            if (s.indexOf(newxy)>-1) continue;
            if ( countBreath(s,tempStoneb,tempStonew).length == 0) 
            {
                rw = rw.concat(s);
            }
        }
        return [rb,rw];
        if (rb.length >0)
        {
            for( var i13=0; i13<rb.length; i13++)
            {
                var xy=rb[i13];
                tempStoneb.splice(tempStoneb.indexOf(xy),1);
            }
        } 
        if (rw.length >0)
        {
            for( var i14=0; i14<rw.length; i14++)
            {
                var xy=rw[i14];
                tempStonew.splice(tempStonew.indexOf(xy),1);
            }
        } 
        if (rb.length >0 || rw.length>0) 
            checkConnect();
    }
    
    function checkSimpleConnect()
    {
        var r = simpleConnect(stoneb,'b');
        sconb = r[0];
        sconbdic = r[1];
        r = simpleConnect(stonew,'w');
        sconw = r[0];
        sconwdic = r[1];
    }
    
    function checkConnect()
    {
        checkSpace(stoneb,stonew);
        checkSimpleConnect();
        //: remove breath == 1   breath == 2 and near border      
        assumeDeadStoneb = [];
        assumeDeadStonew = [];
        var tempsconb = [];
        var tempsconw = [];
        var tempstoneb = [];
        var tempstonew = [];
        var tempbdic= {};
        var tempwdic= {};
        for ( var i = 0; i < sconb.length; i++ ) {
            var g = sconb[i];
            if (assumeDead(g,'b'))
                assumeDeadStoneb = assumeDeadStoneb.concat(g);
            else 
            {
                tempsconb.push(g);
                tempstoneb = tempstoneb.concat(g);
                for ( var j = 0; j < g.length; j++ ) {
                    tempbdic[g[j]]=g;
                }
            }
        }
        for ( var i = 0; i < sconw.length; i++ ) {
            var g = sconw[i];
            if (assumeDead(g,'w'))
                assumeDeadStonew = assumeDeadStonew.concat(g);
            else
            {
                tempsconw.push(g);
                tempstonew = tempstonew.concat(g);
                for ( var j = 0; j < g.length; j++ ) 
                {
                    tempwdic[g[j]]=g;
                }
            }
        }
        checkSpace(tempstoneb,tempstonew);
        r = advanceConnect(tempsconb,tempbdic,tempstoneb,tempstonew);
        adsconb = r[0];
        adsconbdic = r[1];
        fakestoneb = r[2];
        assiststoneb = tempstoneb.concat(r[2]);
        r = advanceConnect(tempsconw,tempwdic,tempstonew,tempstoneb);
        adsconw = r[0];
        adsconwdic = r[1];
        fakestonew = r[2];
        assiststonew = tempstonew.concat(r[2]);
        for( var i1=0; i1<spacegroupsb.length; i1++)
        {
            var g=spacegroupsb[i1];
            for( var i2=0; i2<g.length; i2++)
            {
                var xy=g[i2];
                if (adsconbdic[xy] != undefined)
                {
                    assiststoneb.splice(assiststoneb.indexOf(xy),1);
                    adsconbdic[xy].splice(adsconbdic[xy].indexOf(xy),1);
                }
            }
        }
        for( var i3=0; i3<spacegroupsw.length; i3++)
        {
            var g=spacegroupsw[i3];
            for( var i4=0; i4<g.length; i4++)
            {
                var xy=g[i4];
                if (adsconwdic[xy] != undefined)
                {
                    assiststonew.splice(assiststonew.indexOf(xy),1);
                    adsconwdic[xy].splice(adsconwdic[xy].indexOf(xy),1);
                }
            }
        }

        for( var i5=0; i5<adsconb.length; i5++)
        {
            var g=adsconb[i5];
            if (countBreath(g).length<=3) continue;
            var wall = getWall(g,assiststonew);
            for( var i6=0; i6<wall.length; i6++)
            {
                var xy=wall[i6];
                adsconbdic[xy] = g;
                g.push(xy);
            }
            assiststoneb = assiststoneb.concat(wall);
            fakestoneb = fakestoneb.concat(wall);
        }
        for( var i7=0; i7<adsconw.length; i7++)
        {
            var g=adsconw[i7];
            if (countBreath(g).length<=3) continue;
            var wall = getWall(g,assiststoneb);
            for( var i8=0; i8<wall.length; i8++)
            {
                var xy=wall[i8];
                adsconwdic[xy] = g;
                g.push(xy);
            }
            assiststonew = assiststonew.concat(wall);
            fakestonew = fakestonew.concat(wall);
        }

    }
    
    function checkSpace(blacks,whites)
    {
        spacegroupsw= [];
        spacegroupsb= [];
        spacesw= [];
        spacesb= [];
        spacegroupsPublic= [];
        spacegroupsdic = {};
        var spaces = findAllSpaces(blacks,whites);
        spacegroups = simpleConnect(spaces,'non',whites,blacks)[0];
        for( var i17=0; i17<spacegroups.length; i17++)
        {
            var g=spacegroups[i17];
            var bw = '';
            for( var i18=0; i18<g.length; i18++)
            {
                var xy=g[i18];
                var r = adjacent(xy,'bw',whites,blacks)[0];
                if (r == 'bw') 
                {
                    bw = 'bw';
                    break;
                }
                else if (bw == '' && r != '') bw = r;
                else if (bw != '' && r != '' && bw != r) 
                {
                    bw = 'bw';
                    break;
                }
            }
            if (bw == 'b')
            {
                spacegroupsb.push(g);
                spacesb = spacesb.concat(g);
                setSpace(g,'b',spacegroupsb.length-1);
            }
            else if (bw == 'w')
            {
                spacegroupsw.push(g);
                spacesw = spacesw.concat(g);
                setSpace(g,'w',spacegroupsw.length-1);
            }
            else if (bw == 'bw')
            {
                spacegroupsPublic.push(g);
                setSpace(g,'p',spacegroupsPublic.length-1);
            }
        }
    }
    function checkTerritory (xy,blacks,whites) {
        var xyrs = getAroundsPotential(xy,blacks,whites);
        var r ='';
        var weightb = 0;
        var weightw = 0;
        /*  different when all +, all -, +&- */ 
        for ( var i = 0; i < xyrs.length; i++ ) {
            var xyr = xyrs[i];
            if ( xyr!=xy && xyr.indexOf('-')==-1 && (blacks.indexOf(xyr)>-1 || whites.indexOf(xyr)>-1 ) ) {
                var d = getDistance(xy,xyr);
                var factor = getFactor(xy,xyr);
                if (blacks.indexOf(xyr)>-1)
                    weightb += factor/d;
                else if (whites.indexOf(xyr)>-1)
                    weightw += factor/d;
            }
        }
        if ( weightw == 0 && weightb>2 || weightw>0 && weightb/weightw > 3)
            r = 'b';
        else if ( weightw >2 && weightb == 0 || weightb>0 && weightw/weightb > 3)
            r = 'w';
        return r;
    }
    function assumeDead(g,color)
    {
        var bs = countBreath(g)
        if (bs.length==1) 
            return true;
        else if(bs.length==2) 
        {
            if (getMaxXY(bs[0])==9 && getMaxXY(bs[1])==9 && spacegroupsdic[bs[0]].type == 'p' && spacegroupsdic[bs[1]].type == 'p')
            {
                var adjs =  adjacent(bs[0],color).concat(adjacent(bs[1],color));
                for ( var j = 0; j < adjs.length; j++ ) {
                    if (g.indexOf(adjs[j])==-1) return false;
                }
                return true;
            }
        }
        return false;
    }
    function assumeDeadAdvance(group,spacegroupsColor,color)
    {
        var bs = countBreath(group,assiststoneb,assiststonew);
        var privateSpaces = [];
        var publics = [];
        var publicsnum = 0;
        var breathPublicnum = 0;
        var maxPublic = [];
        var allPublic = [];
        for ( var i = 0; i < bs.length; i++ ) 
        {
            var xy = bs[i];
            var b = spacegroupsdic[xy];
            if (b.type == 'p') 
                breathPublicnum += 1;
            if (b.type != 'p' && privateSpaces.indexOf(spacegroupsColor[b.index]) ==-1)
                privateSpaces.push(spacegroupsColor[b.index]);
            if (b.type == 'p' && publics.indexOf(spacegroupsPublic[b.index]) ==-1)
            {
                publics.push(spacegroupsPublic[b.index]);
                allPublic = allPublic.concat(spacegroupsPublic[b.index]);
                publicsnum += spacegroupsPublic[b.index].length;
                if (spacegroupsPublic[b.index].length>maxPublic.length) 
                    maxPublic = spacegroupsPublic[b.index];
            }
        }
        if (privateSpaces.length >= 2) return true;
        if ( privateSpaces.length == 0 ) {
            /* if (breathPublicnum < 4) return false; */
            /* if (maxPublic.length < 10) return false; */
            if (breathPublicnum < 4 && publicsnum < 10) return false;
            if (breathPublicnum < 8 && allPublic.length > 0 && allPublic.length<80)
            {
                var friends = 0;
                var enimies = 0;
                for ( var j = 0; j < allPublic.length; j++ ) {
                    var s = allPublic[j];
                    var t = checkTerritory(s,assiststoneb,assiststonew);
                    if (t==color)
                        friends += 1;
                    else if ( t!= '')
                        enimies += 1;
                }
            }
            if (friends == 0 && enimies>0 || friends>0 && enimies/friends > 2)
                return false;
        }
        if (privateSpaces.length == 1 && privateSpaces[0].length == 4 && publicsnum<1) //square
        {
            var xs= [];
            var ys= [];
            for ( var k = 0; k < privateSpaces[0].length; k++ ) {
            /* for (lt xy0 of privateSpaces[0]) */
                var xy0 = privateSpaces[0][k];
                xs.push(cartesiandic[xy0[0]]);
                ys.push(cartesiandic[xy0[1]]);
            }
            /* This about equal to Math.max(xs[0],xs[1] ...) */
            if (Math.max.apply(null, xs)-Math.min.apply(null, xs)==1 && Math.max.apply(null, ys)-Math.min.apply(null, ys)==1) return false;
        }
        if (privateSpaces.length == 1 && privateSpaces[0].length > 2) 
            return true;
        if (privateSpaces.length == 1 && privateSpaces[0].length <= 2 && maxPublic <1) 
            return false;
        return true;
    }
    function getDistance(xy0,xy1)
    {
        return Math.abs(cartesiandic[xy0[0]]-cartesiandic[xy1[0]])+ Math.abs(cartesiandic[xy0[1]]-cartesiandic[xy1[1]]);
    }
    function getMaxXY(xy)
    {
        return Math.max(Math.abs(cartesiandic[xy[0]]), Math.abs(cartesiandic[xy[1]]));
    }
    function getAroundsPotential (xy,blacks,whites) 
    {
        var r;
        var adjacent1 = adjacent(xy,'non',blacks,whites);
        r = adjacent(xy,'all',blacks,whites);
        var adjacent2 = [];
        for ( var i = 0; i < adjacent1.length; i++ ) {
            var xy1 = adjacent1[i];
            r = mergeArray(r,(adjacent(xy1,'all',blacks,whites) ));
            adjacent2 = mergeArray(adjacent2,(adjacent(xy1,'non',blacks,whites) ));
        }
        for ( var i = 0; i < adjacent2.length; i++ ) {
            var xy2 = adjacent2[i];
            r = mergeArray(r,(adjacent(xy2,'all',blacks,whites) ));
        }
        return r;
    }
    var factorDic= {7:1,8:2,9:3};
    function getFactor (xy,xyr) {
        var f = 1;
        var x = Math.abs(cartesiandic[xy[0]]);
        var y = Math.abs(cartesiandic[xy[1]]);
        if (factorDic[x]!= undefined && Math.abs(cartesiandic[xyr[0]])<x)
            f += factorDic[x];
        if (factorDic[y]!= undefined && Math.abs(cartesiandic[xyr[1]])<y)
            f += factorDic[y];
        return f;
    }
    function findAllSpaces (blacks,whites) { 
        var spaces = [];
        for( var i15=0; i15<poslist.length; i15++)
        {
            var x=poslist[i15];
            for( var i16=0; i16<poslist.length; i16++)
            {
                var y=poslist[i16];
                var xy = x+y;
                if (blacks.indexOf(xy)==-1 && whites.indexOf(xy)==-1)
                    spaces.push(xy);
            }
        }
        return spaces;
    }
    function mergeArray(a,b)
    {
        return a.concat(b.filter(function (item) {
                return a.indexOf(item) < 0;
            }));
    }
    function setSpace(group,type,i)
    {
        for( var i19=0; i19<group.length; i19++)
        {
            var xy=group[i19];
            spacegroupsdic[xy] = {type:type,index:i};
        }
    }
    

    function simpleConnect(source,type,sw,sb)
    {
        sw = sw || stonew;
        sb = sb || stoneb;
        var r = [];
        var connects = [];
        var conobj = {};
        for( var i1=0; i1<source.length; i1++)
        {
            var xy=source[i1];
            var as = adjacent(xy,type,sw,sb);
            var inconnect = []; // stone already in connect group
            for( var i2=0; i2<as.length; i2++)
            {
                var axy=as[i2];
                if (inconnect.length == 0 && connects.indexOf(axy)!= -1)
                {
                    inconnect = conobj[axy] ;
                }
                else if (inconnect.length > 0 && connects.indexOf(axy)!= -1 && conobj[axy] != inconnect )
                {
                    var ri = r.indexOf(inconnect);
                    var todel = r.indexOf(conobj[axy]);
                    r[ri] = r[ri].concat(r[todel ]);
                    for( var i3=0; i3<r[ri].length; i3++)
                    {
                        var axys=r[ri][i3];
                        conobj[axys] = r[ri];
                    }
                    inconnect = r[ri];
                    r.splice(todel,1);
                }
            }
            if (inconnect.length == 0)
            {
                r.push([xy]);
                connects.push(xy);
                conobj[xy] = r[r.length -1];
            }
            else 
            {
                inconnect.push(xy);
                connects.push(xy);
                conobj[xy] = inconnect;
            }
        }
        return [r,conobj];
    }

    function advanceConnect(connects,connectsdic,friends,enemies)
    {
        var dels = [];
        var assists = [];
        var assistsdic = {};
        for( var i4=0; i4<connects.length; i4++)
        {
            var group=connects[i4];
            for( var i5=0; i5<group.length; i5++)
            {
                var xy=group[i5];
                var xr = arounddic[ xy.charAt(0)];
                var yr = arounddic[ xy.charAt(1)];
                var str = '';
                var xyrs = getArounds(xy);
                for( var i6=0; i6<xyrs.length; i6++)
                {
                    var xyr=xyrs[i6];
                    if (xyr.indexOf('-')>-1) str += 'O';
                    else if (friends.indexOf(xyr)>-1) str += 'Y';
                    else if (enemies.indexOf(xyr)>-1) str += 'N';
                    else str += 'X';
                }
                var regs = adconnectregs.concat();
                if (cartesiandic[xy[0]]==7) regs = regs.concat(adconnectregs7x);
                if (cartesiandic[xy[0]]==-7) regs = regs.concat(adconnectregs_7x);
                if (cartesiandic[xy[1]]==7) regs = regs.concat(adconnectregs7y);
                if (cartesiandic[xy[1]]==-7) regs = regs.concat(adconnectregs_7y);
                for( var i7=0; i7<regs.length; i7++)
                {
                    var re=regs[i7];
                    if (re[0].test(str))
                    {
                        var isAllConnect = true;
                        for( var i8=0; i8<re[1].length; i8++)
                        {
                            var i=re[1][i8];
                            if (group.indexOf(xyrs[i])==-1 && i!=12 && friends.indexOf(xyrs[i])>-1) 
                                isAllConnect = false;// 12 = the middle stone
                        }
                        if (isAllConnect) continue;
                        for( var i9=0; i9<re[1].length; i9++)
                        {
                            var i=re[1][i9];
                            var toadd = xyrs[i];
                            var ri = connects.indexOf(connectsdic[xy]);
                            if (assists.indexOf(toadd)!=-1 ) continue;
                            if (friends.indexOf(toadd)==-1   )//assist stone
                            {
                                assists.push(toadd);
                                if (assistsdic[ri] == undefined) assistsdic[ri] = [];
                                assistsdic[ri].push(toadd);
                            }
                            else if (connectsdic[xy]!= connectsdic[toadd])
                            {
                                var todel = connects.indexOf(connectsdic[toadd]);
                                dels.push(todel);
                                connects[ri] = connects[ri].concat(connects[todel ]);
                                for( var i10=0; i10<connects[ri].length; i10++)
                                {
                                    var axys=connects[ri][i10];
                                    connectsdic[axys] = connects[ri];
                                }
                                if (assistsdic[todel] != undefined)
                                {
                                    if (assistsdic[ri] == undefined) assistsdic[ri] = [];
                                    assistsdic[ri] = assistsdic[ri].concat(assistsdic[todel]);
                                }
                            }
                        }
                    }
                }
            }
        }
        var newcons = [];
        var newconsdic = {};
        for (var i=0; i<connects.length;i++)
        {
            var g = connects[i];
            if (assistsdic[i] != undefined) g = g.concat(assistsdic[i] );
            if (dels.indexOf(i)==-1) newcons.push(g);
        }
        var test= {};
        for( var i11=0; i11<newcons.length; i11++)
        {
            var group=newcons[i11];
            for( var i12=0; i12<group.length; i12++)
            {
                var xy=group[i12];
                newconsdic[xy] = group;
            }
        }
        return [newcons,newconsdic,assists];
    }
    function getArounds (xy) {
        var xr = arounddic[ xy.charAt(0)];
        var yr = arounddic[ xy.charAt(1)];
        var xyrs = [];
        for( var i13=0; i13<xr.length; i13++)
        {
            var x=xr[i13];
            for( var i14=0; i14<yr.length; i14++)
            {
                var y=yr[i14];
                var xyr = x+y;
                xyrs.push(xyr);
            }
        }
        return xyrs;
    }

    function countBreath(source,sw,sb)
    {
        sw = sw || stonew;
        sb = sb || stoneb;
        var r = [];
        for( var i15=0; i15<source.length; i15++)
        {
            var xy=source[i15];
            var as = adjacent(xy,'non',sw,sb);
            for( var i16=0; i16<as.length; i16++)
            {
                var axy=as[i16];
                if (r.indexOf(axy)== -1) r.push(axy);
            }
        }
        return r;
    }
    
    function adjacent(xy,type,sw,sb)
    {
        type = type || 'all';
        sw = sw || stonew;
        sb = sb || stoneb;
        var r = [];
        var xoff = adjacentdic[xy.charAt(0)];
        var yoff = adjacentdic[xy.charAt(1)];
        var adjs = [];
        var adjws = [];
        var adjbs = [];
        var bw = '';
        for( var i17=0; i17<xoff.length; i17++)
        {
            var i=xoff[i17];
            adjs.push(i+xy.charAt(1));
        }
        for( var i18=0; i18<yoff.length; i18++)
        {
            var i=yoff[i18];
            adjs.push(xy.charAt(0)+i);
        }
        for( var i19=0; i19<adjs.length; i19++)
        {
            var xy=adjs[i19];
            if (type == 'w' && sw.indexOf(xy) != -1)
                r.push(xy);
            else if (type == 'b' && sb.indexOf(xy) != -1)
                r.push(xy);
            else if (type == 'non' && sb.indexOf(xy) == -1 && sw.indexOf(xy) == -1)
                r.push(xy);
            else if (type == 'all') 
                r.push(xy);
            // bw: check spaces belong white or black 
            else if (type == 'bw' && sw.indexOf(xy) != -1) 
                adjws.push(xy);
            else if (type == 'bw' && sb.indexOf(xy) != -1) 
                adjbs.push(xy);
        }
        if (type == 'bw')
        {
            if (adjbs.length>0) bw += 'b';
            if (adjws.length>0) bw += 'w';
            r = [bw];
        }
        return r;
    }
    
    function getWall(group,enemies)
    {
        var angels = [];
        var values = [];
        var s = '';
        var diagonal;
        for( var i23=0; i23<group.length; i23++)
        {
            var xy=group[i23];
            var l = Math.abs(cartesiandic[xy[0]])+Math.abs(cartesiandic[xy[1]]);
            var angel = Math.atan2(cartesiandic[xy[1]],cartesiandic[xy[0]]).toFixed(9);
            angels.push([xy,angel,l ]);
            values.push(angel);
            if (Math.abs(cartesiandic[xy[0]]) == Math.abs(cartesiandic[xy[1]]) ) diagonal = angel;
            s +='\n'+[xy,Math.atan2(cartesiandic[xy[1]],cartesiandic[xy[0]]),l ];
        }
        values.sort();
        if ( diagonal < 0 && diagonal == values[0])
            angels.sort(function(a, b){if (a[1] == b[1]) return b[2]-a[2]; else return  b[1]-a[1]} );
        else if ( diagonal < 0 && diagonal == values[values.length-1])
            angels.sort(function(a, b){if (a[1] == b[1]) return a[2]-b[2]; else return  b[1]-a[1]} );
        else if ( diagonal > 0 && diagonal == values[0])
            angels.sort(function(a, b){if (a[1] == b[1]) return a[2]-b[2]; else return  b[1]-a[1]} );
        else if ( diagonal > 0 && diagonal == values[values.length-1])
            angels.sort(function(a, b){if (a[1] == b[1]) return b[2]-a[2]; else return  b[1]-a[1]} );
        else
            angels.sort(function(a, b){if (a[1] == b[1]) return a[2]-b[2]; else return  b[1]-a[1]} );
        var r;
        var end1;
        var end2;
        var end1xy;
        var end2xy;
        var loop1;
        var loop2;
        var wall1 = [];
        var wall2 = [];
        var len = Math.floor(angels.length/2);
/*  split angels to 2 arrays, check end one by one until find 2 decent walls. */
        if (angels[0][1]>3.1 && angels[angels.length-1][1]<-2.5)
        {
            for (var i=0; i<angels.length;i++)
            {
                if (angels[i][1]>=0 && angels[i+1][1]<0)
                {
                    r = [angels[i][0],angels[i+1][0]];
                    end1 = angels.slice(0,i+1);
                    end2 = angels.slice(i+1,angels.length);
                    /* loop : [0,1,2,... length-1] */
                    loop1 = Array.apply(null, { length: end1.length }).map(function(element, index) { return end1.length-1-index; });
                    loop2 = Array.apply(null, { length: end2.length }).map(function(element, index) { return index; });
                    break;
                }
            }
        } else 
        {
            r = [angels[0][0],angels[angels.length-1][0]];
            end1 = angels.slice(0,len);
            end2 = angels.slice(len,angels.length);
            loop1 = Array.apply(null, { length: end1.length }).map(function(element, index) { return index; });
            loop2 = Array.apply(null, { length: end2.length }).map(function(element, index) { return end2.length-1-index; });
        }
        var line = findLine(r[0],r[1]);
        for ( var i = 0; i < loop1.length; i++ ) {
            end1xy = end1[loop1[i]][0];
            wall1 = findWalls(findEnd(end1xy,line,group),line,enemies);
            if (wall1.length>0)
                break;
        }
        for ( var i = 0; i < loop2.length; i++ ) {
            end2xy = end2[loop2[i]][0];
            wall2 = findWalls(findEnd(end2xy,line,group),line,enemies);
            if (wall2.length>0)
                break;
        }
        wall1 = minusGroup(wall1,group);
        wall2 = minusGroup(wall2,group);
        /*   check two wall is adjacent or not, if true, only keep the short wall */
        if ( wall1.length>0 && wall2.length>0 && (line =='x' && Math.abs(cartesiandic[end1xy[1]] - cartesiandic[end2xy[1]] )==1 || line=='y' && Math.abs(cartesiandic[end1xy[0]] - cartesiandic[end2xy[0]] )==1 ) )
        {
            return [wall1,wall2].sort(function(a,b){return a.length-b.length;})[0];
        }
        return wall1.concat(wall2);
    }
    function findEnd(xy,line,group)
    {
        var xdis =Math.abs(cartesiandic[xy[0]]);
        var ydis =Math.abs(cartesiandic[xy[1]]);
        var es = ['b','r','c','q'];
        if (xdis < 7 && ydis < 7)
        {
            if (line == 'x')
            {
                for( var i24=0; i24<es.length; i24++)
                {
                    var e=es[i24];
                    if ( group.indexOf( e+xy[1])>-1)
                        return e+xy[1];
                }
            }
            if (line == 'y')
            {
                for( var i25=0; i25<es.length; i25++)
                {
                    var e=es[i25];
                    if ( group.indexOf( xy[0]+e)>-1)
                        return xy[0]+e;
                }
            }
        }
        return xy;
    }
    
    function findWalls(xy,line,enemies)
    {
        var walls = [];
        var xdis =Math.abs(cartesiandic[xy[0]]);
        var ydis =Math.abs(cartesiandic[xy[1]]);
        if (xdis>=7 && (xdis>ydis || xdis==ydis && line=='x') )
        {
            var add = [];
            var around = arounddic[xy[0]];
            for( var i29=0; i29<around.length; i29++)
            {
                var a=around[i29];
                if (Math.abs(cartesiandic[a])>xdis) add.push(a);
            }
            for( var i30=0; i30<add.length; i30++)
            {
                var a=add[i30];
                if (enemies.indexOf(a+xy[1])>-1  ) return [];
                else walls.push(a+xy[1]);
            }
        }
        if (ydis>=7 && (xdis<ydis || xdis==ydis && line=='y')  )
        {
            var add = [];
            var around = arounddic[xy[1]];
            for( var i31=0; i31<around.length; i31++)
            {
                var a=around[i31];
                if (Math.abs(cartesiandic[a])>ydis) add.push(a);
            }
            for( var i32=0; i32<add.length; i32++)
            {
                var a=add[i32];
                if (enemies.indexOf(xy[0]+a)>-1  ) return [];
                else walls.push(xy[0]+a);
            }
        }
        return walls;
    }
    function findLine(xy1,xy2)
    {
        var line;
        if (Math.abs(cartesiandic[xy1[0]] - cartesiandic[xy2[0]]) > Math.abs(cartesiandic[xy1[1]] - cartesiandic[xy2[1]]) )
            line = 'y';
        else line = 'x';
        return line;
    }
    function minusGroup(all,group)
    {
        var r = [];
        for ( var i = 0; i < all.length; i++ ) {
            if (group.indexOf(all[i])==-1 )
                r.push(all[i]);
        }
        return r;
    }
}
