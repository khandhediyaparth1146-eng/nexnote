import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useWorkspace } from '../../context/WorkspaceContext';
import { motion } from 'framer-motion';

const KnowledgeGraph = () => {
    const { notes } = useWorkspace();

    const graphData = useMemo(() => {
        const nodes = notes.map(n => ({
            id: n._id,
            name: n.title,
            val: n.content?.length > 500 ? 20 : 10,
            group: n.tags?.[0] || 'General'
        }));

        const links = [];
        for (let i = 0; i < notes.length; i++) {
            for (let j = i + 1; j < notes.length; j++) {
                // If they share tags, create a link
                const sharedTags = notes[i].tags.filter(t => notes[j].tags.includes(t));
                if (sharedTags.length > 0) {
                    links.push({
                        source: notes[i]._id,
                        target: notes[j]._id,
                        value: sharedTags.length * 2
                    });
                }
            }
        }

        return { nodes, links };
    }, [notes]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 bg-background h-screen overflow-hidden text-white"
        >
            <div className="absolute top-4 left-72 z-10 w-80 bg-slate-800/80 p-4 border border-slate-700/50 backdrop-blur-md rounded-xl shadow-2xl">
                <h3 className="font-semibold mb-2">Knowledge Graph</h3>
                <p className="text-xs text-slate-400 mb-4">Discover implicit relationships between your notes. (Features 17, 18, 19)</p>
                <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Connected</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Isolated</span>
                </div>
            </div>
            <ForceGraph2D
                graphData={graphData}
                nodeAutoColorBy="group"
                nodeLabel="name"
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={1.5}
                backgroundColor="#0F172A"
            />
        </motion.div>
    );
};

export default KnowledgeGraph;
