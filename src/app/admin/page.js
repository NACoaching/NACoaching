"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Plus, Save, Trash2, Lock, ShoppingBag, FileText, Mail, Activity, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState(null);
    const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'products', 'content'
    const [articles, setArticles] = useState([]);
    const [products, setProducts] = useState([]);
    const [siteContent, setSiteContent] = useState([]);
    const [messages, setMessages] = useState([]);
    const [comments, setComments] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [editingItem, setEditingItem] = useState(null); // { type: 'article' | 'product', id: '...' }
    const [logoUrl, setLogoUrl] = useState("/logo.png");
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchData();
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchData();
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        async function fetchLogo() {
            const { data } = await supabase.from('site_content').select('value').eq('key', 'logo_url').single();
            if (data) setLogoUrl(data.value);
        }
        fetchLogo();
    }, []);

    // Forms Data
    const [articleForm, setArticleForm] = useState({
        title: '', category: '', excerpt: '', content: '', image: '', cta: '',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    });

    const [productForm, setProductForm] = useState({
        title: '', price: '', description: '', features: '', stripeurl: '', image: '', images: [], content: '', file_path: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) alert('Erreur de connexion : ' + error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const fetchData = async () => {
        setLoading(true);
        const [articlesRes, productsRes, contentRes, messagesRes, commentsRes, subscribersRes, analyticsRes] = await Promise.all([
            supabase.from('articles').select('*').order('created_at', { ascending: false }),
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('site_content').select('*').order('key'),
            supabase.from('messages').select('*').order('created_at', { ascending: false }),
            supabase.from('comments').select('*').order('created_at', { ascending: false }),
            supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
            supabase.from('page_views').select('*') // GetAll views to aggregate locally (simple for small scale)
        ]);

        if (articlesRes.data) setArticles(articlesRes.data);
        if (productsRes.data) setProducts(productsRes.data);
        if (contentRes.data) setSiteContent(contentRes.data);
        if (messagesRes.data) setMessages(messagesRes.data);
        if (commentsRes.data) setComments(commentsRes.data);
        if (subscribersRes.data) setSubscribers(subscribersRes.data);
        if (analyticsRes.data) {
            // Aggregate views by path
            const viewsByPath = analyticsRes.data.reduce((acc, curr) => {
                acc[curr.page_path] = (acc[curr.page_path] || 0) + 1;
                return acc;
            }, {});
            const sorted = Object.entries(viewsByPath)
                .map(([path, count]) => ({ path, count }))
                .sort((a, b) => b.count - a.count);
            setAnalytics(sorted);
        }
        setLoading(false);
    };

    const handleArticleChange = (e) => setArticleForm({ ...articleForm, [e.target.name]: e.target.value });
    const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

    // Handle Content Edit (Local State)
    const handleContentChange = (key, newValue) => {
        setSiteContent(prev => {
            const exists = prev.find(item => item.key === key);
            if (exists) {
                return prev.map(item => item.key === key ? { ...item, value: newValue } : item);
            } else {
                return [...prev, { key, value: newValue, label: '' }];
            }
        });
    };

    // Save Content to Supabase (Upsert to handle new keys)
    const saveContent = async (key, value, label = '') => {
        const { error } = await supabase.from('site_content').upsert({ key, value, label }, { onConflict: 'key' });
        if (error) alert('Erreur : ' + error.message);
        else alert('Contenu sauvegardé !');
    };

    // ... (rest of the code)

    // Define Tool Fields for robust rendering
    const toolFields = [
        {
            id: '1rm',
            name: 'Calculateur 1RM',
            fields: [
                { key: 'tool_1rm_title', label: 'Titre Outil 1RM', type: 'text' },
                { key: 'tool_1rm_intro', label: 'Intro Outil 1RM', type: 'text' },
                { key: 'tool_1rm_content', label: 'Contenu SEO Outil 1RM', type: 'html' }
            ]
        },
        {
            id: 'calories',
            name: 'Calculateur Calories',
            fields: [
                { key: 'tool_calories_title', label: 'Titre Outil Calories', type: 'text' },
                { key: 'tool_calories_intro', label: 'Intro Outil Calories', type: 'text' },
                { key: 'tool_calories_content', label: 'Contenu SEO Outil Calories', type: 'html' }
            ]
        },
        {
            id: 'speed',
            name: 'Convertisseur Vitesse',
            fields: [
                { key: 'tool_speed_title', label: 'Titre Outil Vitesse', type: 'text' },
                { key: 'tool_speed_intro', label: 'Intro Outil Vitesse', type: 'text' },
                { key: 'tool_speed_content', label: 'Contenu SEO Outil Vitesse', type: 'html' }
            ]
        },
        {
            id: 'vma',
            name: 'VMA / VO2max',
            fields: [
                { key: 'tool_vma_title', label: 'Titre Outil VMA/VO2', type: 'text' },
                { key: 'tool_vma_intro', label: 'Intro Outil VMA/VO2', type: 'text' },
                { key: 'tool_vma_content', label: 'Contenu SEO Outil VMA/VO2', type: 'html' }
            ]
        },
        {
            id: 'hr',
            name: 'Zones Cardiaques',
            fields: [
                { key: 'tool_hr_title', label: 'Titre Outil FC', type: 'text' },
                { key: 'tool_hr_intro', label: 'Intro Outil FC', type: 'text' },
                { key: 'tool_hr_content', label: 'Contenu SEO Outil FC', type: 'html' }
            ]
        }
    ];




    const handleEdit = (item, type) => {
        setEditingItem({ type, id: item.id });
        if (type === 'article') {
            setArticleForm({
                title: item.title, category: item.category, excerpt: item.excerpt,
                content: item.content, image: item.image, cta: item.cta, date: item.date
            });
        } else {
            setProductForm({
                title: item.title, price: item.price, description: item.description,
                features: item.features ? item.features.join(', ') : '', stripeurl: item.stripeurl, image: item.image,
                images: item.images || (item.image ? [item.image] : []),
                content: item.content || '',
                file_path: item.file_path || ''
            });
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setArticleForm({
            title: '', category: '', excerpt: '', content: '', image: '', cta: '',
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        setProductForm({
            title: '', price: '', description: '', features: '', stripeurl: '', image: '', images: [], content: '', file_path: ''
        });
    };

    const handleArticleSubmit = async (e) => {
        e.preventDefault();

        let error;
        if (editingItem && editingItem.type === 'article') {
            const { error: err } = await supabase.from('articles').update(articleForm).eq('id', editingItem.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('articles').insert([articleForm]);
            error = err;
        }

        if (error) alert('Erreur : ' + error.message);
        else {
            alert(editingItem ? 'Article modifié !' : 'Article ajouté !');
            cancelEdit();
            fetchData();
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        // Features are stored as array, user inputs comma separated string
        const featuresArray = productForm.features.split(',').map(f => f.trim());

        // Create payload
        const productData = {
            ...productForm,
            features: featuresArray,
            // Ensure we save the first image of the array as the main image for backward compatibility
            image: productForm.images && productForm.images.length > 0 ? productForm.images[0] : productForm.image
        };

        let error;
        if (editingItem && editingItem.type === 'product') {
            const { error: err } = await supabase.from('products').update(productData).eq('id', editingItem.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('products').insert([productData]);
            error = err;
        }

        if (error) alert('Erreur : ' + error.message);
        else {
            alert(editingItem ? 'Produit modifié !' : 'Produit ajouté !');
            cancelEdit();
            fetchData();
        }
    };

    const handleImageUpload = async (e, formSetter, currentForm) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadStatus('Uploading...');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

            formSetter({ ...currentForm, image: publicUrl });
            setUploadStatus('Upload réussi !');
            setTimeout(() => setUploadStatus(null), 3000);

        } catch (error) {
            alert('Erreur upload : ' + error.message);
            setUploadStatus('Erreur upload');
        }
    };

    const handleMultipleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadStatus(`Uploading ${files.length} images...`);

        try {
            const newImages = [];
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `prod-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                newImages.push(publicUrl);
            }

            setProductForm(prev => ({
                ...prev,
                images: [...(prev.images || []), ...newImages]
            }));

            setUploadStatus('Upload réussi !');
            setTimeout(() => setUploadStatus(null), 3000);
        } catch (error) {
            alert('Erreur upload multiple : ' + error.message);
            setUploadStatus('Erreur upload');
        }
    };

    const removeImage = (indexToRemove) => {
        setProductForm(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const deleteItem = async (table, id) => {
        await supabase.from(table).delete().eq('id', id);
        fetchData();
    };

    const toggleCommentApproval = async (comment) => {
        const { error } = await supabase.from('comments').update({ is_approved: !comment.is_approved }).eq('id', comment.id);
        if (error) alert("Erreur : " + error.message);
        else fetchData();
    };



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadStatus('Uploading PDF...');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`; // In secure_products bucket

            const { error: uploadError } = await supabase.storage.from('secure_products').upload(filePath, file);

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                throw uploadError;
            }

            // We store the path, not the public URL (because it's private)
            setProductForm({ ...productForm, file_path: filePath });
            setUploadStatus('PDF Uploadé !');
            setTimeout(() => setUploadStatus(null), 3000);

        } catch (error) {
            alert('Erreur upload PDF : ' + error.message);
            setUploadStatus('Erreur upload PDF');
        }
    };

    // ... (Login code)
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg border border-zinc-800 w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <img src={logoUrl} alt="NA Coaching" className="h-20 w-auto" />
                    </div>
                    <h1 className="text-2xl font-black text-center mb-6 uppercase">Accès Back Office</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded mb-4 text-white focus:border-[#FF6B00] outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded mb-4 text-white focus:border-[#FF6B00] outline-none"
                    />
                    <button type="submit" className="w-full bg-[#FF6B00] text-black font-black py-3 rounded uppercase hover:bg-white transition">Se connecter</button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
            <nav className="bg-black text-white py-4 px-6 mb-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={siteContent.find(c => c.key === 'logo_url')?.value || "/logo.png"} alt="NA Coaching" className="h-8 w-auto" />
                    <h1 className="text-xl font-black uppercase text-[#FF6B00]">NA Coaching <span className="text-white">Admin</span></h1>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-bold hover:text-[#FF6B00] flex items-center gap-2">
                        <ArrowLeft size={16} /> Retour au site
                    </Link>
                    <button onClick={handleLogout} className="text-sm font-bold text-zinc-500 hover:text-white transition">
                        Se déconnecter
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6">

                {/* TABS */}
                <div className="flex gap-4 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'articles' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <FileText size={20} /> Articles
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'products' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <ShoppingBag size={20} /> Produits
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'content' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <FileText size={20} /> Contenu
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'messages' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Mail size={20} /> Messages {messages.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{messages.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'comments' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <FileText size={20} /> Commentaires {comments.filter(c => !c.is_approved).length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{comments.filter(c => !c.is_approved).length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('newsletter')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'newsletter' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Mail size={20} /> Newsletter {subscribers.length > 0 && <span className="bg-zinc-800 text-white text-[10px] px-2 rounded-full">{subscribers.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-black uppercase tracking-widest transition ${activeTab === 'analytics' ? 'bg-[#FF6B00] text-black' : 'bg-white text-zinc-400'}`}
                    >
                        <Activity size={20} /> Stats
                    </button>
                </div>

                {activeTab === 'analytics' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase">Top Pages</h2>
                            <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded">Total vues: {analytics.reduce((acc, curr) => acc + curr.count, 0)}</span>
                        </div>
                        <div className="space-y-6">
                            {analytics.length === 0 ? (
                                <p className="text-zinc-500 italic">Pas encore assez de données.</p>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.map((page, index) => {
                                        // Try to find article title if it's a blog post
                                        let pageLabel = page.path;
                                        if (page.path === '/') pageLabel = '🏠 Accueil';
                                        else if (page.path === '/labo') pageLabel = '🧪 Le Labo';
                                        else if (page.path === '/boutique') pageLabel = '🛍️ Boutique';
                                        else if (page.path.startsWith('/blog/')) {
                                            const articleId = page.path.split('/').pop();
                                            const article = articles.find(a => a.id.toString() === articleId);
                                            if (article) pageLabel = `📄 Article : ${article.title}`;
                                        }

                                        return (
                                            <div key={page.path} className="flex items-center gap-4">
                                                <div className="w-6 font-black text-zinc-300 text-sm">#{index + 1}</div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between text-xs font-bold mb-2 uppercase text-zinc-600">
                                                        <span>{pageLabel}</span>
                                                        <span>{page.count}</span>
                                                    </div>
                                                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#FF6B00]"
                                                            style={{ width: `${(page.count / analytics[0].count) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'newsletter' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Abonnés Newsletter ({subscribers.length})</h2>
                        <div className="space-y-4">
                            {subscribers.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun abonné pour le moment.</p>
                            ) : (
                                <div className="space-y-2">
                                    {subscribers.map(sub => (
                                        <div key={sub.id} className="flex justify-between items-center bg-zinc-50 p-3 rounded border border-zinc-100">
                                            <span className="font-bold">{sub.email}</span>
                                            <span className="text-zinc-400 text-xs">{new Date(sub.created_at).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => deleteItem('subscribers', sub.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'comments' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Modération des Commentaires ({comments.length})</h2>
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun commentaire.</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className={`border-l-4 p-4 rounded bg-zinc-50 ${comment.is_approved ? 'border-green-500' : 'border-orange-500'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-black uppercase text-sm">{comment.author_name}</span>
                                                <span className="text-zinc-400 text-xs ml-2">
                                                    sur l'article {articles.find(a => a.id === comment.article_id)?.title || 'Inconnu'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${comment.is_approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {comment.is_approved ? 'Publié' : 'En attente'}
                                                </span>
                                                <span className="text-zinc-400 text-xs">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-zinc-600 text-sm mb-4">{comment.content}</p>
                                        <div className="flex gap-4 border-t border-zinc-200 pt-3">
                                            <button
                                                onClick={() => toggleCommentApproval(comment)}
                                                className={`text-xs font-bold uppercase px-3 py-2 rounded transition ${comment.is_approved ? 'bg-zinc-200 hover:bg-zinc-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                            >
                                                {comment.is_approved ? 'Masquer' : 'Valider'}
                                            </button>
                                            <button
                                                onClick={() => deleteItem('comments', comment.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : activeTab === 'content' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Personnalisation des textes</h2>
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00]">Héros (Accueil)</h3>
                            {siteContent.filter(item => ['hero_title', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Barre d'Expertise</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {siteContent.filter(item => item.key.startsWith('expertise_')).map(item => (
                                    <div key={item.key}>
                                        <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                        <div className="flex gap-2 items-start">
                                            <input
                                                value={item.value}
                                                onChange={(e) => handleContentChange(item.key, e.target.value)}
                                                className="w-full border p-3 rounded text-sm"
                                            />
                                            <button
                                                onClick={() => saveContent(item.key, item.value)}
                                                className="bg-black text-white px-3 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                            >
                                                <Save size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Boîte Expert (Articles)</h3>
                            {siteContent.filter(item => ['expert_box_title', 'expert_box_text'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Page d'Accueil (Hero)</h3>
                            {siteContent.filter(item => ['hero_title', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Sections & Textes Divers</h3>
                            {siteContent.filter(item => ['about_title', 'about_text', 'shop_title', 'shop_subtitle'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Contact (Appel à l'action)</h3>
                            {siteContent.filter(item => item.key.startsWith('contact_cta_')).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[50px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Pied de Page (Footer)</h3>
                            {siteContent.filter(item => ['footer_text', 'footer_newsletter_title', 'footer_newsletter_text', 'footer_follow_title', 'footer_copyright', 'footer_sub_copyright'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <input
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Identité Visuelle</h3>
                            <div className="flex-grow">
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Logo du Site</label>
                                <div className="flex items-center gap-4 mb-2">
                                    <img src={siteContent.find(c => c.key === 'logo_url')?.value || "/logo.png"} alt="Logo" className="h-12 w-auto bg-zinc-100 p-1 rounded" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
                                            const { error } = await supabase.storage.from('images').upload(fileName, file);
                                            if (error) { alert('Erreur upload Supabase: ' + error.message); return; }

                                            const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                            if (!data || !data.publicUrl) { alert('Erreur: Pas de publicUrl reçue'); return; }

                                            const publicUrl = data.publicUrl;
                                            handleContentChange('logo_url', publicUrl);
                                            saveContent('logo_url', publicUrl);
                                        }}
                                        className="text-xs"
                                    />
                                </div>
                                <input
                                    value={siteContent.find(c => c.key === 'logo_url')?.value}
                                    onChange={(e) => handleContentChange('logo_url', e.target.value)}
                                    className="w-full border p-3 rounded text-sm bg-zinc-50 text-zinc-500"
                                    disabled
                                />
                            </div>


                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-6">Page Produit (Détails)</h3>
                            {siteContent.filter(item => ['product_page_back_link', 'product_page_features_title', 'product_page_subtitle', 'product_page_cta'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <input
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-8">Pages Légales</h3>
                            <button
                                onClick={async () => {
                                    if (!confirm('Voulez-vous initialiser le contenu légal par défaut ?')) return;
                                    const legalDefaults = [
                                        { key: 'legal_mentions', label: 'Mentions Légales', value: `EDITEUR DU SITE\nLe site na-coaching.com est édité par [VOTRE NOM], micro-entrepreneur, immatriculé sous le numéro SIRET [VOTRE SIRET], dont le siège social est situé au [VOTRE ADRESSE].\n\nDirecteur de la publication : [VOTRE NOM]\nContact : [VOTRE EMAIL]\n\nHÉBERGEMENT\nLe site est hébergé par Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.\n\nPROPRIÉTÉ INTELLECTUELLE\nL’ensemble de ce site relève de la législation française et internationale sur le droit d’auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.` },
                                        { key: 'privacy_policy', label: 'Politique de Confidentialité', value: `COLLECTE DES DONNÉES\nLes informations recueillies via le formulaire de contact ou l'inscription à la newsletter sont enregistrées dans un fichier informatisé par NA Coaching. Elles sont destinées à la gestion de la clientèle.\n\nDROIT D'ACCÈS\nConformément à la loi « informatique et libertés », vous pouvez exercer votre droit d'accès aux données vous concernant et les faire rectifier en contactant : [VOTRE EMAIL].\n\nCOOKIES\nCe site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites anonymes via Supabase et Vercel Analytics.` }
                                    ];
                                    for (const item of legalDefaults) {
                                        await saveContent(item.key, item.value, item.label);
                                    }
                                    fetchData();
                                }}
                                className="mb-4 text-xs font-bold text-zinc-500 hover:text-[#FF6B00] underline"
                            >
                                Initialiser le contenu par défaut (Template)
                            </button>
                            {siteContent.filter(item => ['legal_mentions', 'privacy_policy'].includes(item.key)).map(item => (
                                <div key={item.key}>
                                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">{item.label}</label>
                                    <div className="flex gap-4 items-start">
                                        <textarea
                                            value={item.value}
                                            onChange={(e) => handleContentChange(item.key, e.target.value)}
                                            className="w-full border p-3 rounded text-sm min-h-[200px]"
                                        />
                                        <button
                                            onClick={() => saveContent(item.key, item.value)}
                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <h3 className="text-lg font-bold uppercase border-b pb-2 text-[#FF6B00] pt-8">SEO Outils Gratuits</h3>
                            <p className="text-sm text-zinc-500 mb-6">Modifiez ici les titres, descriptions et contenus de référencement pour chaque outil.
                                <button
                                    onClick={async () => {
                                        if (!confirm('Voulez-vous initialiser le contenu SEO par défaut ? Cela ajoutera les champs manquants.')) return;

                                        const defaultContent = [
                                            // 1RM
                                            { key: 'tool_1rm_title', label: 'Titre Outil 1RM', value: `Calculateur 1RM - Calculez votre charge maximale en musculation` },
                                            { key: 'tool_1rm_intro', label: 'Intro Outil 1RM', value: `Estimez votre 1RM (Répétition Maximale) pour mieux calibrer vos entraînements de force et d'hypertrophie. Basé sur les formules de Brzycki et Epley.` },
                                            {
                                                key: 'tool_1rm_content', label: 'Contenu SEO Outil 1RM', value: `
<h2>Pourquoi calculer son 1RM ?</h2>
<p>Le <strong>1RM (One Repetition Maximum)</strong> est la charge maximale que vous pouvez soulever sur une seule répétition avec une technique correcte. C'est une donnée fondamentale pour structurer un programme de force.</p>
<ul>
    <li>📈 <strong>Calibrer l'intensité :</strong> Les programmes utilisent souvent des pourcentages du 1RM (ex: 70% pour l'hypertrophie, 85%+ pour la force).</li>
    <li>🚀 <strong>Mesurer la progression :</strong> Tester son 1RM régulièrement permet de valider les gains de force.</li>
    <li>⚠️ <strong>Prévenir les blessures :</strong> Utiliser des charges adaptées évite le surmenage inutile.</li>
</ul>
<h2>Comment utiliser ce calculateur ?</h2>
<p>Entrez une charge que vous maîtrisez sur un exercice (ex: Développé couché) et le nombre de répétitions réalisées avant l'échec technique. L'outil vous donnera une estimation fiable de votre max.</p>
                                                `.trim()
                                            },

                                            // Calories
                                            { key: 'tool_calories_title', label: 'Titre Outil Calories', value: `Calculateur de Besoins Caloriques Journaliers (TDEE)` },
                                            { key: 'tool_calories_intro', label: 'Intro Outil Calories', value: `Déterminez vos besoins énergétiques quotidiens (Maintien, Sèche, Prise de masse) selon votre métabolisme de base et votre niveau d'activité.` },
                                            {
                                                key: 'tool_calories_content', label: 'Contenu SEO Outil Calories', value: `
<h2>Comprendre ses besoins caloriques</h2>
<p>Pour atteindre vos objectifs physiques, l'alimentation est clé. Ce calculateur estime votre <strong>Dépense Énergétique Journalière Totale (TDEE)</strong> en fonction de votre profil.</p>
<h3>Les différents objectifs :</h3>
<ul>
    <li>🔥 <strong>Sèche (Déficit calorique) :</strong> Consommer moins de calories que vous n'en brûlez pour perdre du gras tout en préservant le muscle.</li>
    <li>⚖️ <strong>Maintien :</strong> L'apport calorique idéal pour stabiliser votre poids actuel.</li>
    <li>💪 <strong>Prise de masse (Surplus calorique) :</strong> Un léger surplus pour maximiser la construction musculaire.</li>
</ul>
<p>N'oubliez pas que ces chiffres sont des estimations : ajustez en fonction de votre évolution sur la balance et dans le miroir !</p>
                                                `.trim()
                                            },

                                            // Speed
                                            { key: 'tool_speed_title', label: 'Titre Outil Vitesse', value: `Convertisseur Vitesse : km/h, min/km et m/s` },
                                            { key: 'tool_speed_intro', label: 'Intro Outil Vitesse', value: `Passez facilement des km/h aux allures de course (min/km) pour planifier vos entraînements de running et trail.` },
                                            {
                                                key: 'tool_speed_content', label: 'Contenu SEO Outil Vitesse', value: `
<h2>Pourquoi convertir ses allures ?</h2>
<p>En course à pied, on parle souvent en <strong>minutes par kilomètre (min/km)</strong>, alors que les tapis de course ou les montres affichent parfois des <strong>km/h</strong>. Ce convertisseur unifie tout !</p>
<ul>
    <li>🏃 <strong>Précision à l'entraînement :</strong> Respectez exactement les allures demandées par votre plan (VMA, endurance fondamentale, seuil).</li>
    <li>⏱️ <strong>Gestion de course :</strong> Calculez vos temps de passage prévisionnels sur 10km, semi ou marathon.</li>
</ul>
<p>Un outil indispensable pour tout coureur soucieux de sa performance.</p>
                                                `.trim()
                                            },

                                            // VMA
                                            { key: 'tool_vma_title', label: 'Titre Outil VMA/VO2', value: `Estimation VMA & VO2max - Test de Cooper` },
                                            { key: 'tool_vma_intro', label: 'Intro Outil VMA/VO2', value: `Évaluez votre Vitesse Maximale Aérobie (VMA) et votre VO2max à partir de vos performances sur le terrain (Test de Cooper, Demi-Cooper).` },
                                            {
                                                key: 'tool_vma_content', label: 'Contenu SEO Outil VMA/VO2', value: `
<h2>Qu'est-ce que la VMA ?</h2>
<p>La <strong>Vitesse Maximale Aérobie (VMA)</strong> est la vitesse de course à laquelle votre consommation d'oxygène est maximale (VO2max). C'est le "moteur" du coureur d'endurance.</p>
<ul>
    <li>📊 <strong>Base de l'entraînement :</strong> Toutes vos séances (fractionné, seuil, endurance) se calculent en % de VMA.</li>
    <li>🏆 <strong>Prédicteur de performance :</strong> Une VMA élevée est corrélée à de meilleures performances sur du fond et demi-fond.</li>
</ul>
<p>Utilisez ce calculateur après un test terrain (comme un 6 minutes à fond) pour obtenir vos zones d'entraînement précises.</p>
                                                `.trim()
                                            },

                                            // HR
                                            { key: 'tool_hr_title', label: 'Titre Outil FC', value: `Calculateur de Zones de Fréquence Cardiaque` },
                                            { key: 'tool_hr_intro', label: 'Intro Outil FC', value: `Définissez vos 5 zones d'intensité cardiaque (de l'échauffement à l'effort maximal) basées sur votre FC Max et FC de repos.` },
                                            {
                                                key: 'tool_hr_content', label: 'Contenu SEO Outil FC', value: `
<h2>S'entraîner au cardio-fréquencemètre</h2>
<p>Connaître ses zones cardiaques permet de cibler les bonnes filières énergétiques et d'éviter le surentraînement (ou le sous-entraînement).</p>
<ul>
    <li>💙 <strong>Zone 1-2 (Endurance Fondamentale) :</strong> L'allure d'aisance respiratoire, idéale pour la récupération et le volume. Brûle principalement les graisses.</li>
    <li>💚 <strong>Zone 3 (Seuil Aérobie) :</strong> Travail du rythme, prépare aux courses type marathon.</li>
    <li>🧡 <strong>Zone 4 (Seuil Anaérobie) :</strong> Effort intense mais tenable, pour repousser la fatigue.</li>
    <li>❤️ <strong>Zone 5 (VMA / Sprint) :</strong> Effort maximal, pour développer la puissance du moteur.</li>
</ul>
<p>La méthode de Karvonen utilisée ici prend en compte votre <strong>fréquence cardiaque de repos</strong> pour plus de précision que le simple "220 - âge".</p>
                                                `.trim()
                                            }
                                        ];

                                        const { error } = await supabase.from('site_content').upsert(defaultContent, { onConflict: 'key' });
                                        if (error) alert('Erreur : ' + error.message);
                                        else {
                                            alert('Contenu initialisé !');
                                            fetchData();
                                        }
                                    }}
                                    className="ml-4 bg-[#FF6B00] text-white text-xs px-3 py-1 rounded font-bold uppercase hover:bg-black transition"
                                >
                                    Initialiser / Réinitialiser
                                </button>
                            </p>

                            {toolFields.map(tool => (
                                <div key={tool.id} className="mb-8 p-4 bg-zinc-50 rounded border border-zinc-200">
                                    <h4 className="font-black text-sm uppercase mb-4 text-zinc-700 border-b border-zinc-200 pb-2">{tool.name}</h4>
                                    <div className="space-y-4">
                                        {tool.fields.map(field => {
                                            const contentItem = siteContent.find(c => c.key === field.key);
                                            const value = contentItem ? contentItem.value : '';

                                            return (
                                                <div key={field.key}>
                                                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">{field.label}</label>
                                                    <div className="flex gap-4 items-start">
                                                        <textarea
                                                            value={value}
                                                            onChange={(e) => handleContentChange(field.key, e.target.value)}
                                                            className={`w-full border p-3 rounded text-sm bg-white focus:border-[#FF6B00] outline-none ${field.type === 'html' ? 'min-h-[200px] font-mono text-xs' : 'min-h-[50px]'}`}
                                                            placeholder={field.type === 'html' ? '<p>Votre contenu ici...</p>' : 'Votre texte...'}
                                                        />
                                                        <button
                                                            onClick={() => saveContent(field.key, value, field.label)}
                                                            className="bg-black text-white px-4 rounded font-bold uppercase text-xs hover:bg-[#FF6B00] hover:text-black transition h-fit py-3"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    </div>
                                                    {field.type === 'html' && <p className="text-[10px] text-zinc-400 mt-1 italic">HTML autorisé : &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;...</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'messages' ? (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <h2 className="text-xl font-black mb-6 uppercase">Vos Messages ({messages.length})</h2>
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <p className="text-zinc-500 italic">Aucun message pour le moment.</p>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg.id} className="border-b border-zinc-100 pb-4 last:border-0 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-[#FF6B00] font-black uppercase text-sm">{msg.name}</span>
                                                <span className="text-zinc-400 text-xs ml-2">({msg.email})</span>
                                            </div>
                                            <span className="text-zinc-400 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-bold text-md mb-2">{msg.subject}</h3>
                                        <p className="text-zinc-600 text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => deleteItem('messages', msg.id)}
                                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: FORM */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 sticky top-4">
                                <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
                                    {editingItem ? <Edit className="text-[#FF6B00]" /> : <Plus className="text-[#FF6B00]" />}
                                    {editingItem ? 'Modifier' : (activeTab === 'articles' ? 'Ajouter Article' : 'Ajouter Produit')}
                                </h2>

                                {activeTab === 'articles' ? (
                                    <form onSubmit={handleArticleSubmit} className="space-y-4">
                                        <input required name="title" value={articleForm.title} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm" placeholder="Titre" />
                                        <input required name="category" value={articleForm.category} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm" placeholder="Catégorie" />
                                        <textarea required name="excerpt" value={articleForm.excerpt} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm h-20" placeholder="Extrait" />
                                        <div className="relative">
                                            <textarea required name="content" value={articleForm.content} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm h-40 font-mono text-xs" placeholder="Contenu (Markdown supporté)" />
                                            <div className="text-[10px] text-zinc-400 mt-1 flex justify-between items-center">
                                                <span>**Gras**, *Italique*, # Titre, - Liste</span>
                                                <label className="cursor-pointer text-[#FF6B00] hover:underline flex items-center gap-1">
                                                    <Plus size={10} /> Insérer Image
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            const fileName = `content-${Date.now()}.${file.name.split('.').pop()}`;
                                                            const { error } = await supabase.storage.from('images').upload(fileName, file);
                                                            if (error) { alert(error.message); return; }
                                                            const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                                            const markdown = `\n![Description](${data.publicUrl})\n`;
                                                            setArticleForm(prev => ({ ...prev, content: prev.content + markdown }));
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>


                                        {/* IMAGE UPLOAD ARTICLE */}
                                        <div className="border border-zinc-200 p-2 rounded bg-zinc-50">
                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Image de l'article</label>
                                            <div className="flex items-center gap-4">
                                                {articleForm.image && <img src={articleForm.image} className="w-16 h-16 object-cover rounded" />}
                                                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleImageUpload(e, setArticleForm, articleForm)} className="text-xs" />
                                            </div>
                                            {uploadStatus && <p className="text-xs text-green-600 font-bold mt-2">{uploadStatus}</p>}
                                            <input type="hidden" name="image" value={articleForm.image} />
                                        </div>
                                        <input name="cta" value={articleForm.cta} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm" placeholder="CTA (Produit lié - Optionnel)" />
                                        <input required name="date" value={articleForm.date} onChange={handleArticleChange} className="w-full border p-2 rounded text-sm" />

                                        <div className="flex gap-2">
                                            {editingItem && (
                                                <button type="button" onClick={cancelEdit} className="w-full bg-zinc-200 text-zinc-600 font-bold py-3 rounded uppercase hover:bg-zinc-300 transition">Annuler</button>
                                            )}
                                            <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition flex justify-center items-center gap-2">
                                                <Save size={18} /> {editingItem ? 'Mettre à jour' : 'Publier'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleProductSubmit} className="space-y-4">
                                        <input required name="title" value={productForm.title} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="Nom du produit" />
                                        <input required name="price" value={productForm.price} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="Prix (ex: 39€)" />
                                        <textarea required name="description" value={productForm.description} onChange={handleProductChange} className="w-full border p-2 rounded text-sm h-20" placeholder="Description" />
                                        <textarea required name="features" value={productForm.features} onChange={handleProductChange} className="w-full border p-2 rounded text-sm h-20" placeholder="Caractéristiques (séparées par une virgule)" />

                                        <div className="relative">
                                            <textarea name="content" value={productForm.content} onChange={handleProductChange} className="w-full border p-2 rounded text-sm h-40 font-mono text-xs" placeholder="Description détaillée (Page Produit) - Markdown supporté" />
                                            <div className="text-[10px] text-zinc-400 mt-1 flex justify-between items-center">
                                                <span>**Gras**, *Italique*, # Titre, - Liste</span>
                                                <label className="cursor-pointer text-[#FF6B00] hover:underline flex items-center gap-1">
                                                    <Plus size={10} /> Insérer Image
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            const fileName = `product-content-${Date.now()}.${file.name.split('.').pop()}`;
                                                            const { error } = await supabase.storage.from('images').upload(fileName, file);
                                                            if (error) { alert(error.message); return; }
                                                            const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                                                            const markdown = `\n![Description](${data.publicUrl})\n`;
                                                            setProductForm(prev => ({ ...prev, content: (prev.content || '') + markdown }));
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <input name="stripeurl" value={productForm.stripeurl} onChange={handleProductChange} className="w-full border p-2 rounded text-sm" placeholder="Lien Etsy (Optionnel)" />


                                        {/* IMAGE UPLOAD PRODUCT */}
                                        {/* IMAGE UPLOAD PRODUCT (GALLERY) */}
                                        <div className="border border-zinc-200 p-4 rounded bg-zinc-50">
                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-4">Galerie d'images (La première sera l'image principale)</label>

                                            {/* Current Images Grid */}
                                            {productForm.images && productForm.images.length > 0 && (
                                                <div className="grid grid-cols-4 gap-4 mb-4">
                                                    {productForm.images.map((img, index) => (
                                                        <div key={index} className="relative group aspect-square">
                                                            <img src={img} className="w-full h-full object-cover rounded border border-zinc-200" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                            {index === 0 && <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">Principale</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <label className="cursor-pointer bg-white border border-zinc-300 hover:border-[#FF6B00] text-zinc-700 px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center gap-2">
                                                    <Plus size={16} /> Ajouter des photos
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/png, image/jpeg, image/webp"
                                                        onChange={handleMultipleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {uploadStatus && <p className="text-xs text-green-600 font-bold">{uploadStatus}</p>}
                                            </div>
                                        </div>

                                        {/* PDF UPLOAD (DIGITAL PRODUCT) */}
                                        <div className="border border-zinc-200 p-4 rounded bg-zinc-50 mt-4 mb-4">
                                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Fichier Numérique (PDF)</label>
                                            <div className="flex items-center gap-4">
                                                {productForm.file_path ? (
                                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                                                        <FileText size={14} /> Fichier lié : {productForm.file_path}
                                                        <button
                                                            type="button"
                                                            onClick={() => setProductForm({ ...productForm, file_path: '' })}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-400 text-xs italic">Aucun fichier</span>
                                                )}
                                                <label className="cursor-pointer bg-white border border-zinc-300 hover:border-[#FF6B00] text-zinc-700 px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center gap-2">
                                                    <Plus size={16} /> Uploader PDF
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.zip"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 mt-2">Ce fichier sera stocké de manière sécurisée et envoyé uniquement après paiement.</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {editingItem && (
                                                <button type="button" onClick={cancelEdit} className="w-full bg-zinc-200 text-zinc-600 font-bold py-3 rounded uppercase hover:bg-zinc-300 transition">Annuler</button>
                                            )}
                                            <button type="submit" className="w-full bg-black text-white font-black py-3 rounded uppercase hover:bg-[#FF6B00] hover:text-black transition flex justify-center items-center gap-2">
                                                <Save size={18} /> {editingItem ? 'Mettre à jour' : 'Ajouter'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: LIST */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-black mb-6 uppercase">
                                {activeTab === 'articles' ? `Articles (${articles.length})` : `Produits (${products.length})`}
                            </h2>

                            <div className="space-y-4">
                                {activeTab === 'articles' ? (
                                    articles.map(article => (
                                        <div key={article.id} className={`bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-start ${editingItem?.id === article.id ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-zinc-200'}`}>
                                            <img src={article.image} className="w-24 h-24 object-cover rounded bg-zinc-100" />
                                            <div className="flex-grow">
                                                <span className="text-[10px] font-black uppercase text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-1 rounded">{article.category}</span>
                                                <h3 className="font-bold text-lg mt-2 leading-tight">{article.title}</h3>
                                                <div className="flex gap-4 mt-2">
                                                    <button onClick={() => handleEdit(article, 'article')} className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"><Edit size={12} /> Modifier</button>
                                                    <button onClick={() => deleteItem('articles', article.id)} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><Trash2 size={12} /> Supprimer</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    products.map(product => (
                                        <div key={product.id} className={`bg-white p-6 rounded-lg shadow-sm border relative ${editingItem?.id === product.id ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-zinc-200'}`}>
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <button onClick={() => handleEdit(product, 'product')} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                                                <button onClick={() => deleteItem('products', product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-2xl font-black italic text-[#FF6B00]">{product.price}</span>
                                            </div>
                                            <h3 className="text-xl font-black uppercase">{product.title}</h3>
                                            <p className="text-zinc-500 text-sm mt-2">{product.description}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {product.features && product.features.map((f, i) => (
                                                    <span key={i} className="text-[10px] font-bold bg-zinc-100 px-2 py-1 rounded">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div >
    );
}
