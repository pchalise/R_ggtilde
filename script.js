
document.addEventListener("DOMContentLoaded", function() {
    // Initialize the graph
      initGraph();

      function initGraph() {
       // Get full viewport size
       function getViewportSize() {
           return { width: window.innerWidth, height: window.innerHeight };
       }

       let { width, height } = getViewportSize();
       
        // Create SVG with zoom behavior
        const svg = d3.select("#graph")
            .attr("width", width)
            .attr("height", height);

        // Add a background to capture events
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent");

        // Create a main group for all elements that will be affected by zoom
        const g = svg.append("g")
            .attr("class", "main-group");

        // Setup zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Define visualization parameters
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        // Tooltip setup
        const tooltip = d3.select("#tooltip");

        // Define outer nodes (main concept groups)
        const outerGroups = [
            { id: "group1", angle: 0, width: 180, height: 90, color: "#3498db" },
            { id: "group2", angle: Math.PI / 3, width: 180, height: 90, color: "#2ecc71" },
            { id: "group3", angle: 2 * Math.PI / 3, width: 180, height: 90, color: "#9b59b6" },
            { id: "group4", angle: Math.PI, width: 180, height: 90, color: "#e74c3c" },
            { id: "group5", angle: 4 * Math.PI / 3, width: 380, height: 300, color: "#f39c12" },
            { id: "group6", angle: 5 * Math.PI / 3, width: 380, height: 250, color: "#1abc9c" }
        ];

        // Calculate positions for outer groups
        outerGroups.forEach(group => {
            group.x = centerX + radius * Math.cos(group.angle);
            group.y = centerY + radius * Math.sin(group.angle);
        });

        // Define the equations for left nodes
        const leftNodes = [
            { equation: "((x_{g(v)}-x_v) - (x_{g(u)}-x_u))" },
            { equation: "2(x_{g(u)}-x_u)" },
            { equation: "(x_{g^{(2)}(n-1)}-x_{g(n-1)})" },
            { equation: "\\begin{aligned} 2(x_{g(u)}-x_u) & \\\\ \\times (x_{g^{(2)}(n-1)}-x_{g(n-1)}) & \\end{aligned}" },
            { equation: "\\begin{aligned} ((x_{g(v)}-x_v) - (x_{g(u)}-x_u)) & \\\\ \\times ( 2(x_{g(u)}-x_u) - (x_{g^{(2)}(n-1)}-x_{g(n-1)})) & \\end{aligned}" }
        ];

        // Define the equations for right nodes
        const rightNodes = [
            { equation: "((x_{g(v)}-x_v) + i)" },
            { equation: "(-2i - (x_{g^{(2)}(n-1)}-x_{g(n-1)}))" },
            { equation: "\\begin{aligned} ((x_{g(v)}-x_v) + i) & \\\\ \\times (-2i - (x_{g^{(2)}(n-1)}-x_{g(n-1)})) & \\end{aligned}" }
        ];

        // Reference to the left and right group containers
        const leftGroupContainer = outerGroups[4];
        const rightGroupContainer = outerGroups[5];

        // Calculate node positions within groups
        const leftSpacing = leftGroupContainer.height * 0.8 / leftNodes.length;
        const rightSpacing = rightGroupContainer.height * 0.8 / rightNodes.length;

        // Position left nodes inside their container
        leftNodes.forEach((node, i) => {
            node.x = leftGroupContainer.x;
            node.y = leftGroupContainer.y - (leftGroupContainer.height * 0.4) + (i * leftSpacing);

            // Determine if the equation uses the aligned environment
            node.multiline = node.equation.includes("\\begin{aligned}");

            // Calculate dimensions based on equation complexity
            if (node.multiline) {
                node.width = 220;
                node.height = 70;
            } else {
                node.width = Math.max(120, Math.min(node.equation.length * 4.5, 200));
                node.height = 45;
            }
        });

        // Position right nodes inside their container
        rightNodes.forEach((node, i) => {
            node.x = rightGroupContainer.x;
            node.y = rightGroupContainer.y - (rightGroupContainer.height * 0.4) + (i * rightSpacing);

            // Determine if the equation uses the aligned environment
            node.multiline = node.equation.includes("\\begin{aligned}");

            // Calculate dimensions based on equation complexity
            if (node.multiline) {
                node.width = 220;
                node.height = 70;
            } else {
                node.width = Math.max(120, Math.min(node.equation.length * 4.5, 200));
                node.height = 45;
            }
        });

        // Create outer group containers
        const outerGroupsG = g.selectAll(".outer-group")
            .data(outerGroups)
            .enter()
            .append("g")
            .attr("class", "outer-group")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Add rectangles for outer groups
        outerGroupsG.append("rect")
            .attr("x", d => -d.width / 2)
            .attr("y", d => -d.height / 2)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("rx", 20)
            .attr("ry", 20)
            .attr("fill", d => d.color)
            .attr("fill-opacity", 0.7)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 0.8)
            .attr("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))");

        // Create left nodes
        const leftNodesG = g.selectAll(".left-node")
            .data(leftNodes)
            .enter()
            .append("g")
            .attr("class", "node left-node")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Add rectangles for left nodes
        leftNodesG.append("rect")
            .attr("class", "node-rect")
            .attr("x", d => -d.width / 2)
            .attr("y", d => -d.height / 2)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", "rgba(255, 255, 230, 0.9)")
            .attr("stroke", "#333")
            .attr("filter", "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.2))")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("stroke", "#ff9900").attr("stroke-width", 3);
                showNodeConnections(d, true);
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
                showNodeConnections(d, false);
                tooltip.style("opacity", 0);
            });

        // Add equation text to left nodes
        leftNodesG.each(function(d) {
            const g = d3.select(this);
            const foreignWidth = d.width * 0.9;
            const foreignHeight = d.height * 0.9;

            // Determine font size based on equation complexity
            let fontSize = d.multiline ? "11px" : "12px";
            if (d.equation.length > 60) fontSize = "10px";

            g.append("foreignObject")
                .attr("x", -foreignWidth / 2)
                .attr("y", -foreignHeight / 2)
                .attr("width", foreignWidth)
                .attr("height", foreignHeight)
                .append("xhtml:div")
                .attr("class", "equation-container")
                .style("font-size", fontSize)
                .html("\\(" + d.equation + "\\)");
        });

        // Create right nodes
        const rightNodesG = g.selectAll(".right-node")
            .data(rightNodes)
            .enter()
            .append("g")
            .attr("class", "node right-node")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Add rectangles for right nodes
        rightNodesG.append("rect")
            .attr("class", "node-rect")
            .attr("x", d => -d.width / 2)
            .attr("y", d => -d.height / 2)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", "rgba(255, 255, 230, 0.9)")
            .attr("stroke", "#333")
            .attr("filter", "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.2))")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("stroke", "#ff9900").attr("stroke-width", 3);
                showNodeConnections(d, true);
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
                showNodeConnections(d, false);
                tooltip.style("opacity", 0);
            });

        // Add equation text to right nodes
        rightNodesG.each(function(d) {
            const g = d3.select(this);
            const foreignWidth = d.width * 0.9;
            const foreignHeight = d.height * 0.9;

            // Determine font size based on equation complexity
            let fontSize = d.multiline ? "11px" : "12px";
            if (d.equation.length > 60) fontSize = "10px";

            g.append("foreignObject")
                .attr("x", -foreignWidth / 2)
                .attr("y", -foreignHeight / 2)
                .attr("width", foreignWidth)
                .attr("height", foreignHeight)
                .append("xhtml:div")
                .attr("class", "equation-container")
                .style("font-size", fontSize)
                .html("\\(" + d.equation + "\\)");
        });

        // Draw connections between every left node and every right node
        const connectionsGroup = g.append("g").attr("class", "connections");

        leftNodes.forEach(leftNode => {
            rightNodes.forEach(rightNode => {
                // Calculate a unique ID for each connection
                const connectionId = `connection-${leftNodes.indexOf(leftNode)}-${rightNodes.indexOf(rightNode)}`;

                // Create a curved path between nodes with a slight randomization
                const controlOffsetX = (Math.random() * 60) - 30;
                const controlOffsetY = (Math.random() * 60) - 130;

                const controlX = (leftNode.x + rightNode.x) / 2 + controlOffsetX;
                const controlY = (leftNode.y + rightNode.y) / 2 + controlOffsetY;

                connectionsGroup.append("path")
                    .attr("id", connectionId)
                    .attr("class", `connection left-${leftNodes.indexOf(leftNode)} right-${rightNodes.indexOf(rightNode)}`)
                    .attr("d", `M${leftNode.x},${leftNode.y} Q${controlX},${controlY} ${rightNode.x},${rightNode.y}`)
                    .attr("fill", "none")
                    .attr("stroke", "rgba(255, 255, 255, 0.3)")
                    .attr("stroke-width", 1.5)
                    .attr("data-left", leftNodes.indexOf(leftNode))
                    .attr("data-right", rightNodes.indexOf(rightNode));
            });
        });

        // Function to highlight connections
        function showNodeConnections(node, highlight) {
            const isLeftNode = leftNodes.includes(node);
            const index = isLeftNode
                ? leftNodes.indexOf(node)
                : rightNodes.indexOf(node);

            const selector = isLeftNode
                ? `.connection.left-${index}`
                : `.connection.right-${index}`;

            d3.selectAll(".connection")
                .transition()
                .duration(200)
                .attr("stroke", "rgba(255, 255, 255, 0.15)")
                .attr("stroke-width", 1);

            if (highlight) {
                d3.selectAll(selector)
                    .transition()
                    .duration(200)
                    .attr("stroke", "rgba(255, 215, 0, 0.8)")
                    .attr("stroke-width", 2.5);

                tooltip
                    .style("left", (d3.event ? d3.event.pageX : event.pageX) + 15 + "px")
                    .style("top", (d3.event ? d3.event.pageY : event.pageY) - 30 + "px")
                    .html(`<strong>Equation:</strong> ${node.equation.replace(/\\begin\{aligned\}|\\\\/g, "")}`)
                    .style("opacity", 1);
            } else {
                d3.selectAll(".connection")
                    .transition()
                    .duration(200)
                    .attr("stroke", "rgba(255, 255, 255, 0.3)")
                    .attr("stroke-width", 1.5);
            }
        }

        // Add floating animation to nodes
        function floatingAnimation() {
            // Apply random subtle floating animation to all nodes
            d3.selectAll(".node")
                .transition()
                .duration(3000 + Math.random() * 2000)
                .ease(d3.easeSinInOut)
                .attr("transform", function(d) {
                    const offsetY = Math.random() * 10 - 5;
                    return `translate(${d.x}, ${d.y + offsetY})`;
                })
                .on("end", function(d) {
                    d3.select(this)
                        .transition()
                        .duration(3000 + Math.random() * 2000)
                        .ease(d3.easeSinInOut)
                        .attr("transform", function(d) {
                            return `translate(${d.x}, ${d.y})`;
                        })
                        .on("end", floatingAnimation);
                });
        }

        // Start the floating animation
        floatingAnimation();

        // Configure MathJax
        if (typeof MathJax !== 'undefined') {
            if (MathJax.Hub) {
                // MathJax 2
                MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['\\(', '\\)']],
                        processEscapes: true
                    },
                    "HTML-CSS": {
                        scale: 90
                    }
                });

                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

                setTimeout(function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                }, 500);
            } else {
                // MathJax 3
                MathJax.typeset();

                setTimeout(function() {
                    MathJax.typeset();
                }, 500);
            }
        }

        // Setup controls
        document.getElementById("zoomInBtn").addEventListener("click", function() {
            svg.transition()
                .duration(300)
                .call(zoom.scaleBy, 1.3);
        });

        document.getElementById("zoomOutBtn").addEventListener("click", function() {
            svg.transition()
                .duration(300)
                .call(zoom.scaleBy, 0.7);
        });

        document.getElementById("resetBtn").addEventListener("click", function() {
            svg.transition()
                .duration(500)
                .call(zoom.transform, d3.zoomIdentity);
        });

        // Initial zoom to fit everything
        const initialScale = 0.85;
        svg.call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width/2, height/2)
                .scale(initialScale)
                .translate(-centerX, -centerY)
        );

        // Add window resize handler
        window.addEventListener("resize", function() {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            svg.attr("width", newWidth)
               .attr("height", newHeight);

            svg.select("rect")
               .attr("width", newWidth)
               .attr("height", newHeight);
        });
    }
});
