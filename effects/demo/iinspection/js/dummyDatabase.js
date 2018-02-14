(function () {
  /**
   * This file emulates a database.
   *
   * The properly formatted JSON file of the graph can be found in '/graph.json'.
   */

  var GRAPH = {"nodes":[{"id":0,"data":{"type":"Customer","properties":{"country":"USA","fullname":"John Piggyback","age":32},"nbNeighbors":6},"neighbors":{"edges":[0,1,2,3,4,5],"nodes":[4,2,3,1,6,5]}},{"id":1,"data":{"type":"Phone","properties":{"name":"123-878-000"},"nbNeighbors":2},"neighbors":{"edges":[3,18],"nodes":[0,15]}},{"id":2,"data":{"type":"SSN","properties":{"name":985365741},"nbNeighbors":1},"neighbors":{"edges":[1],"nodes":[0]}},{"id":3,"data":{"type":"Address","properties":{"city":"Key West","street":"Eisenhower Street","state":"Florida"},"nbNeighbors":1},"neighbors":{"edges":[2],"nodes":[0]}},{"id":4,"data":{"type":"MailAddress","properties":{"name":"john.piggyback@gmail.com"},"nbNeighbors":1},"neighbors":{"edges":[0],"nodes":[0]}},{"id":5,"data":{"type":"Claim","properties":{"amount":51000,"name":"Property damage"},"nbNeighbors":3},"neighbors":{"edges":[5,6,8],"nodes":[0,8,7]}},{"id":6,"data":{"type":"Claim","properties":{"amount":49000,"name":"Property Damage"},"nbNeighbors":3},"neighbors":{"edges":[4,7,9],"nodes":[0,8,7]}},{"id":7,"data":{"type":"Lawyer","properties":{"fullname":"Keeley Bins"},"nbNeighbors":3},"neighbors":{"edges":[8,9,10],"nodes":[5,6,9]}},{"id":8,"data":{"type":"Evaluator","properties":{"fullname":"Patrick Collison"},"nbNeighbors":3},"neighbors":{"edges":[6,7,11],"nodes":[5,6,9]}},{"id":9,"data":{"type":"Claim","properties":{"amount":50999,"name":"Property damage"},"nbNeighbors":3},"neighbors":{"edges":[10,11,12],"nodes":[7,8,10]}},{"id":10,"data":{"type":"Customer","properties":{"fullname":"Werner Stiedemann"},"nbNeighbors":5},"neighbors":{"edges":[12,13,14,15,16],"nodes":[9,11,12,13,14]}},{"id":11,"data":{"type":"Address","properties":{"city":"Alexanemouth","street":"Wuckert Curve","state":"Delaware"},"nbNeighbors":1},"neighbors":{"edges":[13],"nodes":[10]}},{"id":12,"data":{"type":"MailAddress","properties":{"name":"soluta@hotmail.com"},"nbNeighbors":2},"neighbors":{"edges":[14,17],"nodes":[10,15]}},{"id":13,"data":{"type":"Phone","properties":{"name":"485-256-662"},"nbNeighbors":1},"neighbors":{"edges":[15],"nodes":[10]}},{"id":14,"data":{"type":"SSN","properties":{"name":196546546},"nbNeighbors":1},"neighbors":{"edges":[16],"nodes":[10]}},{"id":15,"data":{"type":"Customer","properties":{"fullname":"Paula Smith"},"nbNeighbors":4},"neighbors":{"edges":[17,18,19,20],"nodes":[12,1,17,16]}},{"id":16,"data":{"type":"SSN","properties":{"name":123785945},"nbNeighbors":1},"neighbors":{"edges":[20],"nodes":[15]}},{"id":17,"data":{"type":"Address","properties":{"city":"Los Angeles","street":"Pasadena Street","state":"California"},"nbNeighbors":1},"neighbors":{"edges":[19],"nodes":[15]}}],"edges":[{"id":0,"source":0,"target":4,"data":{"type":"HAS_ADDRESS","properties":{}}},{"id":1,"source":0,"target":2,"data":{"type":"HAS_SSN","properties":{}}},{"id":2,"source":0,"target":3,"data":{"type":"HAS_ADDRESS","properties":{}}},{"id":3,"source":0,"target":1,"data":{"type":"HAS_PHONE","properties":{}}},{"id":4,"source":0,"target":6,"data":{"type":"HAS_CLAIM","properties":{}}},{"id":5,"source":0,"target":5,"data":{"type":"HAS_CLAIM","properties":{}}},{"id":6,"source":8,"target":5,"data":{"type":"IS_INVOLVED","properties":{}}},{"id":7,"source":8,"target":6,"data":{"type":"IS_INVOLVED","properties":{}}},{"id":8,"source":7,"target":5,"data":{"type":"IS_INVOLVED","properties":{}}},{"id":9,"source":7,"target":6,"data":{"type":"IS_INVOLVED","properties":{}}},{"id":10,"source":7,"target":9,"data":{"type":"IS_INVOLVED","properties":{}}},{"id":11,"source":8,"target":9,"data":{"type":"IS_INVOLVED","properties":{}}},{"id":12,"source":10,"target":9,"data":{"type":"HAS_CLAIM","properties":{}}},{"id":13,"source":10,"target":11,"data":{"type":"HAS_ADDRESS","properties":{}}},{"id":14,"source":10,"target":12,"data":{"type":"HAS_MAIL","properties":{}}},{"id":15,"source":10,"target":13,"data":{"type":"HAS_PHONE","properties":{}}},{"id":16,"source":10,"target":14,"data":{"type":"HAS_SSN","properties":{}}},{"id":17,"source":12,"target":15,"data":{"type":"HAS_MAIL","properties":{}}},{"id":18,"source":15,"target":1,"data":{"type":"HAS_PHONE","properties":{}}},{"id":19,"source":15,"target":17,"data":{"type":"HAS_ADDRESS","properties":{}}},{"id":20,"source":15,"target":16,"data":{"type":"HAS_SSN","properties":{}}}]};


  var DB = {
    // Search a node by its `fullname` property
    search: function (name) {
      return GRAPH.nodes.filter(function (node) {
        var fullname = node.data.properties.fullname;

        return fullname && fullname.toLowerCase().indexOf(name.toLowerCase()) === 0;
      })[0] || null;
    },

    // Retrieve the list of neighbors of a node
    getNeighbors: function (id) {
      var neighborsIds = GRAPH.nodes[id].neighbors;

      return {
        nodeIds: neighborsIds.nodes,
        edgeIds: neighborsIds.edges,
        nodes: neighborsIds.nodes.map(function (nid) { return GRAPH.nodes[nid]; }),
      }
    },
	//根据id取得边
	getEdgeById: function(id) {
		for(var edge in GRAPH.edges) {
			if(GRAPH.edges[edge].id == id){
				return GRAPH.edges[edge];
			}
		}
	},
	
	//根据id取得边
	getNodeById: function(id) {
		for(var node in GRAPH.nodes) {
			if(GRAPH.nodes[node].id == id){
				return GRAPH.nodes[node];
			}
		}
	},
    // Retrieve the list of adjacent edges of a list of nodes
    getAdjacentEdges: function (ids) {
      let edges = [];

      GRAPH.edges.forEach(function (edge) {
        if (ids.indexOf(edge.source) !== -1 || ids.indexOf(edge.target) !== -1) {
          edges.push(edge);
        }
      });

      return edges;
    },

    // Returns the whole graph
    getFullGraph: function () {
      return GRAPH;
    }
  };

  // window.DB = DB;
  // window.GRAPH = GRAPH;
})();