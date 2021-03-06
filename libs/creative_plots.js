// Generated by IcedCoffeeScript 1.6.2d
(function() {
  var CreativePlots, SpecialUsers;



  CreativePlots = (function() {
    var k, materials, plot_ownerships, plot_size, plot_world, road_materials, road_size, v;

    function CreativePlots() {}

    plot_size = 80;

    road_size = 5;

    plot_world = 'creative';

    plot_ownerships = JsPersistence.tryGet('creative_plots', {});

    CreativePlots.Ownerships = plot_ownerships;

    materials = [
      {
        depth: 1,
        material: 7
      }, {
        depth: 9,
        material: 3
      }, {
        depth: 9,
        material: 3
      }, {
        depth: 1,
        material: 2
      }
    ];

    road_materials = [
      {
        depth: 1,
        material: 7
      }, {
        depth: 18,
        center_material: 20,
        edge_material: 7
      }, {
        depth: 1,
        center_material: 44,
        edge_material: 43
      }, {
        depth: 1,
        center_material: 0,
        edge_material: 85,
        breakAtCenter: 1
      }, {
        depth: 5,
        material: 0
      }
    ];

    CreativePlots.PlotOwnership = (function() {
      function PlotOwnership(x, y, owner) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        if (this.owner instanceof org.bukkit.entity.Player) {
          this.owner = _s(this.owner.name);
        }
      }

      PlotOwnership.prop('hashCode', {
        get: function() {
          return PlotOwnership.GetHashCode(this.x, this.y);
        }
      });

      PlotOwnership.prop('plot', {
        get: function() {
          return new CreativePlots.Plot(this.x, this.y);
        }
      });

      PlotOwnership.GetHashCode = function(x, y) {
        return "" + x + "," + y + "," + plot_world;
      };

      PlotOwnership.CountByOwner = function(owner) {
        var count, hash, plot;
        count = 0;
        for (hash in plot_ownerships) {
          plot = plot_ownerships[hash];
          if (plot.owner === owner) {
            ++count;
          }
        }
        return count;
      };

      PlotOwnership.MaxOwnedBy = function(owner) {
        if (SpecialUsers.prototype.IsVip(owner)) {
          return 3;
        }
        if (SpecialUsers.prototype.IsVeteran(owner)) {
          return 2;
        }
        return 1;
      };

      PlotOwnership.prototype.fromJson = function(json) {
        var js;
        js = JSON.parse(json);
        return new PlotOwnership(js.x, js.y, js.owner);
      };

      PlotOwnership.prototype.renderSigns = function(player) {
        var getText;
        getText = function() {};
        if (this.owner === 'CONSOLE') {
          getText = function() {
            return "\n\xA75Spawn Plot";
          };
        } else {
          getText = function() {
            return "\n\xA75Plot owned by\n\xA74" + this.owner;
          };
        }
        return CreativePlots.prototype.GeneratePlotSigns(player, this.x, this.y, getText);
      };

      return PlotOwnership;

    })();

    for (k in plot_ownerships) {
      v = plot_ownerships[k];
      plot_ownerships[k] = CreativePlots.PlotOwnership.prototype.fromJson(JSON.stringify(v));
    }

    CreativePlots.Plot = (function() {
      function Plot(x, y) {
        this.x = x;
        this.y = y;
      }

      Plot.prototype.generate = function(player) {
        return CreativePlots.prototype.GeneratePlot(player, this.x, this.y, true, true, true);
      };

      Plot.prototype.refreshPlot = function(player) {
        return CreativePlots.prototype.GeneratePlot(player, this.x, this.y, true, false, false);
      };

      Plot.prototype.fixRoads = function(player) {
        return CreativePlots.prototype.GeneratePlot(player, this.x, this.y, false, true, true);
      };

      Plot.GetHashCode = function(x, y) {
        return "" + x + "," + y + "," + plot_world;
      };

      Plot.prop('hashCode', {
        get: function() {
          return CreativePlots.PlotOwnership.GetHashCode(this.x, this.y);
        }
      });

      Plot.prototype.placeSigns = function(player) {
        if (plot_ownerships[this.hashCode] == null) {
          return;
        }
        return plot_ownerships[this.hashCode].renderSigns(player);
      };

      return Plot;

    })();

    CreativePlots.WorldEdit = (function() {
      var JTypes;

      JTypes = (function() {
        function JTypes() {}

        JTypes.classLoader = "WorldEdit".plugin["class"].classLoader;

        JTypes.bukkitWorld = JTypes.classLoader.loadClass("com.sk89q.worldedit.bukkit.BukkitWorld");

        JTypes.vector = JTypes.classLoader.loadClass("com.sk89q.worldedit.Vector");

        JTypes.cube = JTypes.classLoader.loadClass("com.sk89q.worldedit.regions.CuboidRegion");

        JTypes.singleBlock = JTypes.classLoader.loadClass("com.sk89q.worldedit.patterns.SingleBlockPattern");

        JTypes.baseBlock = JTypes.classLoader.loadClass("com.sk89q.worldedit.blocks.BaseBlock");

        JTypes.localWorld = JTypes.classLoader.loadClass("com.sk89q.worldedit.LocalWorld");

        JTypes.bukkitWorldCon = JTypes.bukkitWorld.getDeclaredConstructor([org.bukkit.World]);

        JTypes.vectorCon = JTypes.vector.getDeclaredConstructor([java.lang.Double.TYPE, java.lang.Double.TYPE, java.lang.Double.TYPE]);

        JTypes.cubeCon = JTypes.cube.getDeclaredConstructor([JTypes.localWorld, JTypes.vector, JTypes.vector]);

        JTypes.singleBlockCon = JTypes.singleBlock.getDeclaredConstructor([JTypes.baseBlock]);

        JTypes.baseBlockCon = JTypes.baseBlock.getDeclaredConstructor([java.lang.Integer.TYPE]);

        return JTypes;

      })();

      WorldEdit.JTypes = JTypes;

      function WorldEdit(player) {
        this.worldEdit = "WorldEdit".plugin.worldEdit;
        this.consolePlayer = "WorldEdit".plugin.wrapPlayer(player);
        this.session = this.worldEdit.getSession(this.consolePlayer);
        this.editSession = this.session.createEditSession(this.consolePlayer);
        this.localWorld = JTypes.bukkitWorldCon.newInstance([Bukkit.server.getWorld(plot_world)]);
      }

      WorldEdit.prototype.getLoc = function(x, y, z) {
        return JTypes.vectorCon.newInstance([new java.lang.Double(x), new java.lang.Double(y), new java.lang.Double(z)]);
      };

      WorldEdit.prototype.getCubeRegion = function(pos1, pos2) {
        return JTypes.cubeCon.newInstance([this.localWorld, pos1, pos2]);
      };

      WorldEdit.prototype.setMaterial = function(region, pattern) {
        return this.editSession.setBlocks(region, pattern);
      };

      WorldEdit.prototype.getSinglePattern = function(typeId) {
        return JTypes.singleBlockCon.newInstance([JTypes.baseBlockCon.newInstance([new java.lang.Integer(typeId)])]);
      };

      return WorldEdit;

    }).call(this);

    CreativePlots.prototype.GetPlotCenter = function(px, py) {
      return cloneLocation(Bukkit.server.getWorld(plot_world).spawnLocation, {
        x: (plot_size + road_size) * px,
        y: 0,
        z: (plot_size + road_size) * py
      });
    };

    CreativePlots.prototype.GeneratePlot = function(player, px, py, generateLand, generateRoad, cleanGen) {
      var airMat, center, cube, getCube, gx1, gx2, gz1, gz2, mat, pos1, pos2, renderCorner, renderMat, roadPass, sx, sz, worldEdit, y, y1, y2, _i, _j, _len, _len1;
      center = CreativePlots.prototype.GetPlotCenter(px, py);
      worldEdit = new CreativePlots.WorldEdit(player);
      gx1 = center.x - (plot_size / 2) + 1;
      gx2 = center.x + (plot_size / 2) + 0;
      gz1 = center.z - (plot_size / 2) + 1;
      gz2 = center.z + (plot_size / 2) + 0;
      renderMat = function(cube, mat, edge) {
        var type, _ref;
        if (edge == null) {
          edge = false;
        }
        type = (_ref = mat.material) != null ? _ref : (edge ? mat.edge_material : mat.center_material);
        return worldEdit.setMaterial(cube, worldEdit.getSinglePattern(type));
      };
      roadPass = function(mat, shiftFunc) {
        var i, _i, _ref;
        renderMat(shiftFunc(), mat, true);
        for (i = _i = 2, _ref = road_size - 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
          renderMat(shiftFunc(), mat, false);
        }
        return renderMat(shiftFunc(), mat, true);
      };
      renderCorner = function(opt) {
        var i, _i, _j, _k, _l, _ref, _ref1, _ref2;
        renderMat(opt.getCube(), opt.mat, true);
        for (i = _i = 2, _ref = road_size - 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
          opt.shiftX();
          renderMat(opt.getCube(), opt.mat, false);
        }
        opt.shiftX();
        renderMat(opt.getCube(), opt.mat, true);
        for (i = _j = 2, _ref1 = road_size - 1; 2 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 2 <= _ref1 ? ++_j : --_j) {
          opt.shiftZ();
          for (i = _k = 1; 1 <= road_size ? _k <= road_size : _k >= road_size; i = 1 <= road_size ? ++_k : --_k) {
            renderMat(opt.getCube(), opt.mat, false);
            opt.shiftX();
          }
        }
        opt.shiftZ();
        renderMat(opt.getCube(), opt.mat, true);
        for (i = _l = 2, _ref2 = road_size - 1; 2 <= _ref2 ? _l <= _ref2 : _l >= _ref2; i = 2 <= _ref2 ? ++_l : --_l) {
          opt.shiftX();
          renderMat(opt.getCube(), opt.mat, false);
        }
        opt.shiftX();
        return renderMat(opt.getCube(), opt.mat, true);
      };
      y = 0;
      if (generateLand === true) {
        for (_i = 0, _len = materials.length; _i < _len; _i++) {
          mat = materials[_i];
          if (mat.cleanGenOnly && !cleanGen) {
            continue;
          }
          pos1 = worldEdit.getLoc(gx1, y, gz1);
          y += mat.depth - 1;
          pos2 = worldEdit.getLoc(gx2, y, gz2);
          cube = worldEdit.getCubeRegion(pos1, pos2);
          renderMat(cube, mat);
          ++y;
        }
      }
      y = 0;
      if (generateRoad === true) {
        for (_j = 0, _len1 = road_materials.length; _j < _len1; _j++) {
          mat = road_materials[_j];
          if (mat.cleanGenOnly && !cleanGen) {
            continue;
          }
          y1 = y;
          y2 = y + mat.depth - 1;
          sx = -1;
          roadPass(mat, function() {
            pos1 = worldEdit.getLoc(gx1 - 1 - (++sx), y1, gz1);
            pos2 = worldEdit.getLoc(gx1 - 1 - sx, y2, gz2);
            return cube = worldEdit.getCubeRegion(pos1, pos2);
          });
          sx = -1;
          roadPass(mat, function() {
            pos1 = worldEdit.getLoc(gx2 + 1 + (++sx), y1, gz1);
            pos2 = worldEdit.getLoc(gx2 + 1 + sx, y2, gz2);
            return cube = worldEdit.getCubeRegion(pos1, pos2);
          });
          sz = -1;
          roadPass(mat, function() {
            pos1 = worldEdit.getLoc(gx1, y1, gz1 - 1 - (++sz));
            pos2 = worldEdit.getLoc(gx2, y2, gz1 - 1 - sz);
            return cube = worldEdit.getCubeRegion(pos1, pos2);
          });
          sz = -1;
          roadPass(mat, function() {
            pos1 = worldEdit.getLoc(gx1, y1, gz2 + 1 + (++sz));
            pos2 = worldEdit.getLoc(gx2, y2, gz2 + 1 + sz);
            return cube = worldEdit.getCubeRegion(pos1, pos2);
          });
          sx = 0;
          sz = 0;
          pos1 = function() {
            return worldEdit.getLoc(gx1 - 1 - sx, y1, gz1 - 1 - sz);
          };
          pos2 = function() {
            return worldEdit.getLoc(gx1 - 1 - sx, y2, gz1 - 1 - sz);
          };
          renderCorner({
            mat: mat,
            getCube: function() {
              return worldEdit.getCubeRegion(pos1(), pos2());
            },
            shiftX: function() {
              return ++sx;
            },
            shiftZ: function() {
              sx = 0;
              return ++sz;
            }
          });
          sx = 0;
          sz = 0;
          pos1 = function() {
            return worldEdit.getLoc(gx2 + 1 + sx, y1, gz1 - 1 - sz);
          };
          pos2 = function() {
            return worldEdit.getLoc(gx2 + 1 + sx, y2, gz1 - 1 - sz);
          };
          renderCorner({
            mat: mat,
            getCube: function() {
              return worldEdit.getCubeRegion(pos1(), pos2());
            },
            shiftX: function() {
              return ++sx;
            },
            shiftZ: function() {
              sx = 0;
              return ++sz;
            }
          });
          sx = 0;
          sz = 0;
          pos1 = function() {
            return worldEdit.getLoc(gx1 - 1 - sx, y1, gz2 + 1 + sz);
          };
          pos2 = function() {
            return worldEdit.getLoc(gx1 - 1 - sx, y2, gz2 + 1 + sz);
          };
          renderCorner({
            mat: mat,
            getCube: function() {
              return worldEdit.getCubeRegion(pos1(), pos2());
            },
            shiftX: function() {
              return ++sx;
            },
            shiftZ: function() {
              sx = 0;
              return ++sz;
            }
          });
          sx = 0;
          sz = 0;
          pos1 = function() {
            return worldEdit.getLoc(gx2 + 1 + sx, y1, gz2 + 1 + sz);
          };
          pos2 = function() {
            return worldEdit.getLoc(gx2 + 1 + sx, y2, gz2 + 1 + sz);
          };
          renderCorner({
            mat: mat,
            getCube: function() {
              return worldEdit.getCubeRegion(pos1(), pos2());
            },
            shiftX: function() {
              return ++sx;
            },
            shiftZ: function() {
              sx = 0;
              return ++sz;
            }
          });
          if (mat.breakAtCenter != null) {
            getCube = function() {
              return worldEdit.getCubeRegion(pos1(), pos2());
            };
            airMat = {
              material: 0
            };
            pos1 = function() {
              return worldEdit.getLoc(center.x - mat.breakAtCenter + 1, y1, gz1 - 1);
            };
            pos2 = function() {
              return worldEdit.getLoc(center.x + mat.breakAtCenter, y2, gz1 - 1);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(center.x - mat.breakAtCenter + 1, y1, gz1 - road_size);
            };
            pos2 = function() {
              return worldEdit.getLoc(center.x + mat.breakAtCenter, y2, gz1 - road_size);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(center.x - mat.breakAtCenter + 1, y1, gz2 + 1);
            };
            pos2 = function() {
              return worldEdit.getLoc(center.x + mat.breakAtCenter, y2, gz2 + 1);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(center.x - mat.breakAtCenter + 1, y1, gz2 + road_size);
            };
            pos2 = function() {
              return worldEdit.getLoc(center.x + mat.breakAtCenter, y2, gz2 + road_size);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(gx1 - 1, y1, center.z - mat.breakAtCenter + 1);
            };
            pos2 = function() {
              return worldEdit.getLoc(gx1 - 1, y2, center.z + mat.breakAtCenter);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(gx1 - road_size, y1, center.z - mat.breakAtCenter + 1);
            };
            pos2 = function() {
              return worldEdit.getLoc(gx1 - road_size, y2, center.z + mat.breakAtCenter);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(gx2 + 1, y1, center.z - mat.breakAtCenter + 1);
            };
            pos2 = function() {
              return worldEdit.getLoc(gx2 + 1, y2, center.z + mat.breakAtCenter);
            };
            renderMat(getCube(), airMat);
            pos1 = function() {
              return worldEdit.getLoc(gx2 + road_size, y1, center.z - mat.breakAtCenter + 1);
            };
            pos2 = function() {
              return worldEdit.getLoc(gx2 + road_size, y2, center.z + mat.breakAtCenter);
            };
            renderMat(getCube(), airMat);
          }
          y += mat.depth;
        }
      }
      new CreativePlots.Plot(px, py).placeSigns(worldEdit);
      new CreativePlots.Plot(px - 1, py - 1).placeSigns(worldEdit);
      new CreativePlots.Plot(px + 1, py - 1).placeSigns(worldEdit);
      new CreativePlots.Plot(px - 1, py + 1).placeSigns;
      new CreativePlots.Plot(px + 1, py + 1).placeSigns();
      return 'Hooray!';
    };

    CreativePlots.prototype.GeneratePlotSigns = function(worldEdit, px, py, getText) {
      var center, gx1, gx2, gz1, gz2, lines, mat, sb, sign, signMat, y, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      center = CreativePlots.prototype.GetPlotCenter(px, py);
      gx1 = center.x - (plot_size / 2) + 1;
      gx2 = center.x + (plot_size / 2) + 0;
      gz1 = center.z - (plot_size / 2) + 1;
      gz2 = center.z + (plot_size / 2) + 0;
      y = 0;
      signMat = null;
      for (_i = 0, _len = road_materials.length; _i < _len; _i++) {
        mat = road_materials[_i];
        if (mat.breakAtCenter == null) {
          y += mat.depth;
          continue;
        }
        signMat = mat;
        break;
      }
      sb = cloneLocation(center, {
        x: center.x + 1 + signMat.breakAtCenter,
        y: y,
        z: gz1 - 2
      });
      sb = sb.block;
      sb.type = Material.WALL_SIGN;
      sb.data = 2;
      lines = getText().split('\n');
      sign = sb.state;
      sign.setLine(0, ((_ref = lines[0]) != null ? _ref : '').substr(0, 16));
      sign.setLine(1, ((_ref1 = lines[1]) != null ? _ref1 : '').substr(0, 16));
      sign.setLine(2, ((_ref2 = lines[2]) != null ? _ref2 : '').substr(0, 16));
      sign.setLine(3, ((_ref3 = lines[3]) != null ? _ref3 : '').substr(0, 16));
      sign.update(true);
      sb = cloneLocation(center, {
        x: center.x - 1 - signMat.breakAtCenter,
        y: y,
        z: gz2 + 2
      });
      sb = sb.block;
      sb.type = Material.WALL_SIGN;
      sb.data = 2;
      lines = getText().split('\n');
      sign = sb.state;
      sign.setLine(0, ((_ref4 = lines[0]) != null ? _ref4 : '').substr(0, 16));
      sign.setLine(1, ((_ref5 = lines[1]) != null ? _ref5 : '').substr(0, 16));
      sign.setLine(2, ((_ref6 = lines[2]) != null ? _ref6 : '').substr(0, 16));
      sign.setLine(3, ((_ref7 = lines[3]) != null ? _ref7 : '').substr(0, 16));
      return sign.update(true);
    };

    return CreativePlots;

  }).call(this);

  SpecialUsers = (function() {
    function SpecialUsers() {}

    SpecialUsers.prototype.veterans = JSON.parse(read_file("./js/veterans.json"));

    SpecialUsers.prototype.vips = JSON.parse(read_file("./js/vips.json"));

    SpecialUsers.prototype.IsVip = function(name) {
      var vip, _i, _len, _ref;
      _ref = SpecialUsers.prototype.vips;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vip = _ref[_i];
        if (vip === _s(name)) {
          return true;
        }
      }
      return false;
    };

    SpecialUsers.prototype.IsVeteran = function(name, orVip) {
      var vet, _i, _len, _ref;
      if (orVip == null) {
        orVip = true;
      }
      _ref = SpecialUsers.prototype.veterans;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vet = _ref[_i];
        if (vet === _s(name)) {
          return true;
        }
      }
      return orVip && SpecialUsers.prototype.IsVip(name);
    };

    return SpecialUsers;

  })();

}).call(this);
