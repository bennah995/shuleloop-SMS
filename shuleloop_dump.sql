--
-- PostgreSQL database dump
--

\restrict Sz3EqJH4hb9Ecx324H1n7iKkqRhNTXoF9lrRYrmdhU2woYfCr5Xjp5RNVTw3yre

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    student_id integer NOT NULL,
    date date NOT NULL,
    status character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    term_id integer,
    class_id integer,
    CONSTRAINT attendance_status_check CHECK (((status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying])::text[])))
);


--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    school_id integer NOT NULL,
    teacher_id integer,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: grades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    student_id integer NOT NULL,
    subject_id integer NOT NULL,
    term character varying(50) NOT NULL,
    score numeric(5,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    term_id integer,
    class_id integer
);


--
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    student_id integer NOT NULL,
    type character varying(50) NOT NULL,
    payload text,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: platform_admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_admins (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: platform_admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.platform_admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: platform_admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.platform_admins_id_seq OWNED BY public.platform_admins.id;


--
-- Name: report_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_comments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    term character varying(50) NOT NULL,
    teacher_comment text,
    principal_comment text
);


--
-- Name: report_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.report_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: report_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.report_comments_id_seq OWNED BY public.report_comments.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    next_admission_number integer DEFAULT 1 NOT NULL,
    subdomain character varying(63),
    custom_domain character varying(255),
    logo_url text,
    brand_color character varying(7),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    contact_name character varying(255),
    contact_email character varying(255),
    rejection_reason text,
    CONSTRAINT schools_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'suspended'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: student_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_subjects (
    id integer NOT NULL,
    student_id integer NOT NULL,
    subject_id integer NOT NULL
);


--
-- Name: student_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_subjects_id_seq OWNED BY public.student_subjects.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    school_id integer NOT NULL,
    class_id integer,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    admission_number integer
);


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(30) NOT NULL,
    CONSTRAINT subjects_category_check CHECK (((category)::text = ANY ((ARRAY['compulsory'::character varying, 'optional_compulsory'::character varying, 'humanities'::character varying, 'technical'::character varying])::text[])))
);


--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.terms (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    year integer NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: terms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.terms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.terms_id_seq OWNED BY public.terms.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    school_id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL,
    must_change_password boolean DEFAULT false NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['principal'::character varying, 'teacher'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: platform_admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_admins ALTER COLUMN id SET DEFAULT nextval('public.platform_admins_id_seq'::regclass);


--
-- Name: report_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_comments ALTER COLUMN id SET DEFAULT nextval('public.report_comments_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: student_subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_subjects ALTER COLUMN id SET DEFAULT nextval('public.student_subjects_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: terms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms ALTER COLUMN id SET DEFAULT nextval('public.terms_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance (id, student_id, date, status, created_at, term_id, class_id) FROM stdin;
90	24	2026-07-31	present	2026-07-31 00:30:56.871352	\N	\N
91	8	2026-07-31	present	2026-07-31 00:30:58.674952	\N	\N
92	28	2026-07-30	present	2026-07-31 01:13:25.154631	\N	\N
7	1	2026-07-25	present	2026-07-27 02:04:03.654183	1	1
6	1	2026-07-26	present	2026-07-27 02:03:41.700764	1	1
1	1	2026-07-27	present	2026-07-27 01:40:57.3184	1	1
30	2	2026-07-27	present	2026-07-27 13:40:12.986498	1	1
2	2	2026-07-26	present	2026-07-27 02:03:35.522642	1	1
8	2	2026-07-25	present	2026-07-27 02:04:04.427828	1	1
31	3	2026-07-27	present	2026-07-27 13:40:13.732923	1	1
3	3	2026-07-26	absent	2026-07-27 02:03:37.260555	1	1
9	3	2026-07-25	present	2026-07-27 02:04:05.548181	1	1
32	4	2026-07-27	absent	2026-07-27 13:40:14.845087	1	1
10	4	2026-07-25	present	2026-07-27 02:04:06.882346	1	1
4	4	2026-07-26	present	2026-07-27 02:03:38.641389	1	1
33	5	2026-07-27	present	2026-07-27 13:40:15.352803	1	1
5	5	2026-07-26	present	2026-07-27 02:03:39.687	1	1
16	6	2026-07-27	present	2026-07-27 13:39:46.845158	1	2
14	7	2026-07-27	absent	2026-07-27 13:36:37.695703	1	2
17	8	2026-07-27	present	2026-07-27 13:39:47.792458	1	2
15	9	2026-07-27	present	2026-07-27 13:39:45.625972	1	2
19	10	2026-07-27	present	2026-07-27 13:39:52.144164	1	3
20	11	2026-07-27	present	2026-07-27 13:39:53.213627	1	3
18	12	2026-07-27	present	2026-07-27 13:39:51.744118	1	3
21	13	2026-07-27	present	2026-07-27 13:39:53.919701	1	3
22	14	2026-07-27	absent	2026-07-27 13:39:58.778949	1	4
25	15	2026-07-27	present	2026-07-27 13:40:01.300001	1	4
24	16	2026-07-27	present	2026-07-27 13:40:00.438965	1	4
23	17	2026-07-27	present	2026-07-27 13:39:59.617791	1	4
27	18	2026-07-27	present	2026-07-27 13:40:05.737317	1	5
26	19	2026-07-27	present	2026-07-27 13:40:04.887663	1	5
29	20	2026-07-27	absent	2026-07-27 13:40:07.079062	1	5
28	21	2026-07-27	present	2026-07-27 13:40:06.360257	1	5
34	1	2026-07-28	present	2026-07-28 03:02:45.75568	1	1
36	9	2026-07-29	present	2026-07-29 13:38:30.205249	\N	\N
37	6	2026-07-29	present	2026-07-29 13:38:31.555782	\N	\N
38	8	2026-07-29	present	2026-07-29 13:38:32.731801	\N	\N
39	12	2026-07-29	absent	2026-07-29 14:02:11.726153	\N	\N
40	10	2026-07-29	present	2026-07-29 14:02:13.039913	\N	\N
41	11	2026-07-29	present	2026-07-29 14:02:13.757303	\N	\N
42	13	2026-07-29	present	2026-07-29 14:02:14.396487	\N	\N
43	17	2026-07-29	present	2026-07-29 14:02:17.996841	\N	\N
44	14	2026-07-29	present	2026-07-29 14:02:18.641536	\N	\N
45	16	2026-07-29	present	2026-07-29 14:02:19.076267	\N	\N
46	15	2026-07-29	present	2026-07-29 14:02:19.547951	\N	\N
47	19	2026-07-29	present	2026-07-29 14:02:21.827285	\N	\N
48	18	2026-07-29	present	2026-07-29 14:02:22.35082	\N	\N
49	21	2026-07-29	present	2026-07-29 14:02:22.829832	\N	\N
50	20	2026-07-29	present	2026-07-29 14:02:23.328292	\N	\N
51	1	2026-07-29	present	2026-07-29 14:02:26.084818	\N	\N
52	2	2026-07-29	present	2026-07-29 14:02:26.517319	\N	\N
53	3	2026-07-29	present	2026-07-29 14:02:26.992727	\N	\N
54	4	2026-07-29	present	2026-07-29 14:02:27.576205	\N	\N
55	5	2026-07-29	present	2026-07-29 14:02:28.087932	\N	\N
35	7	2026-07-29	absent	2026-07-29 13:38:29.427361	\N	\N
57	23	2026-07-30	present	2026-07-30 14:06:47.071962	\N	\N
58	7	2026-07-30	present	2026-07-30 14:06:49.115091	\N	\N
59	9	2026-07-30	present	2026-07-30 14:06:50.420067	\N	\N
60	6	2026-07-30	present	2026-07-30 14:06:51.126626	\N	\N
61	8	2026-07-30	present	2026-07-30 14:06:51.83933	\N	\N
63	10	2026-07-30	present	2026-07-30 14:06:55.448713	\N	\N
62	12	2026-07-30	present	2026-07-30 14:06:54.804215	\N	\N
66	11	2026-07-30	present	2026-07-30 14:06:59.961315	\N	\N
67	22	2026-07-30	present	2026-07-30 14:07:00.618021	\N	\N
68	13	2026-07-30	present	2026-07-30 14:07:01.230843	\N	\N
69	17	2026-07-30	present	2026-07-30 14:07:04.124633	\N	\N
70	14	2026-07-30	present	2026-07-30 14:07:04.793622	\N	\N
71	16	2026-07-30	present	2026-07-30 14:07:05.352205	\N	\N
72	15	2026-07-30	present	2026-07-30 14:07:05.932279	\N	\N
73	19	2026-07-30	present	2026-07-30 14:07:08.275872	\N	\N
74	18	2026-07-30	present	2026-07-30 14:07:08.935289	\N	\N
75	21	2026-07-30	present	2026-07-30 14:07:09.462661	\N	\N
76	20	2026-07-30	present	2026-07-30 14:07:10.05489	\N	\N
77	1	2026-07-30	present	2026-07-30 14:07:12.536751	\N	\N
78	2	2026-07-30	present	2026-07-30 14:07:14.735623	\N	\N
79	3	2026-07-30	absent	2026-07-30 14:07:15.57123	\N	\N
80	4	2026-07-30	absent	2026-07-30 14:07:16.578922	\N	\N
81	5	2026-07-30	absent	2026-07-30 14:07:17.313738	\N	\N
82	24	2026-07-30	present	2026-07-30 20:05:33.989388	\N	\N
83	26	2026-07-30	absent	2026-07-30 20:06:31.198085	\N	\N
84	25	2026-07-30	present	2026-07-30 20:06:45.348622	\N	\N
85	27	2026-07-30	present	2026-07-30 20:06:47.577161	\N	\N
86	23	2026-07-31	present	2026-07-31 00:30:50.140458	\N	\N
87	7	2026-07-31	present	2026-07-31 00:30:51.119847	\N	\N
88	9	2026-07-31	absent	2026-07-31 00:30:52.843779	\N	\N
89	6	2026-07-31	present	2026-07-31 00:30:56.218979	\N	\N
93	30	2026-07-30	present	2026-07-31 01:13:25.934101	\N	\N
94	29	2026-07-30	present	2026-07-31 01:13:26.978544	\N	\N
95	38	2026-08-02	present	2026-08-02 14:48:10.72181	\N	\N
96	39	2026-08-02	present	2026-08-02 14:48:12.904036	\N	\N
97	40	2026-08-02	present	2026-08-02 14:48:15.850599	\N	\N
98	41	2026-08-02	present	2026-08-02 14:48:18.361102	\N	\N
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.classes (id, school_id, teacher_id, name, created_at) FROM stdin;
1	1	2	Grade 5 Blue	2026-07-27 01:40:13.220834
2	1	2	Form 1	2026-07-27 13:08:23.931042
3	1	2	Form 2	2026-07-27 13:08:23.9999
4	1	2	Form 3	2026-07-27 13:08:24.019635
5	1	2	Form 4	2026-07-27 13:08:24.02966
6	2	\N	Form 1	2026-08-02 02:10:17.424714
7	2	\N	Form 2	2026-08-02 02:10:46.991699
8	4	\N	Form 1	2026-08-02 14:45:53.243353
9	4	\N	Form 2	2026-08-02 14:46:21.614877
10	4	\N	Form 3	2026-08-02 14:46:35.701213
11	4	\N	Form 4	2026-08-02 14:46:48.738818
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grades (id, student_id, subject_id, term, score, created_at, term_id, class_id) FROM stdin;
96	6	3	Term 2 2027	45.00	2026-07-31 00:53:43.779396	\N	\N
1	1	3	Term 2 2026	88.00	2026-07-27 14:14:14.064966	1	1
2	2	3	Term 2 2026	70.00	2026-07-27 14:19:30.027372	1	1
4	3	3	Term 2 2026	55.00	2026-07-27 14:21:04.941233	1	1
12	7	10	Term 2 2026	80.00	2026-07-27 14:44:23.011785	1	2
11	7	8	Term 2 2026	40.00	2026-07-27 14:44:08.368972	1	2
10	7	9	Term 2 2026	78.00	2026-07-27 14:43:56.356338	1	2
9	7	3	Term 2 2026	56.00	2026-07-27 14:43:49.148889	1	2
8	7	2	Term 2 2026	82.00	2026-07-27 14:43:42.098493	1	2
7	7	1	Term 2 2026	44.00	2026-07-27 14:43:32.957995	1	2
6	7	5	Term 2 2026	45.00	2026-07-27 14:43:28.206287	1	2
5	7	4	Term 2 2026	56.00	2026-07-27 14:43:23.298266	1	2
13	9	4	Term 1 2026	56.00	2026-07-28 03:20:56.477084	3	2
14	9	5	Term 1 2026	67.00	2026-07-28 03:20:58.042505	3	2
15	9	1	Term 1 2026	78.00	2026-07-28 03:21:00.117451	3	2
16	9	2	Term 1 2026	98.00	2026-07-28 03:21:02.542052	3	2
17	9	3	Term 1 2026	45.00	2026-07-28 03:21:09.612808	3	2
18	9	9	Term 1 2026	66.00	2026-07-28 03:21:13.723606	3	2
19	9	7	Term 1 2026	77.00	2026-07-28 03:21:15.020273	3	2
20	9	12	Term 1 2026	76.00	2026-07-28 03:21:17.988397	3	2
21	7	4	Term 1 2027	24.00	2026-07-29 13:38:52.027489	\N	\N
22	7	5	Term 1 2027	67.00	2026-07-29 13:38:56.298553	\N	\N
23	7	1	Term 1 2027	55.00	2026-07-29 13:39:00.037664	\N	\N
24	7	2	Term 1 2027	77.00	2026-07-29 13:39:02.547994	\N	\N
25	7	3	Term 1 2027	65.00	2026-07-29 13:39:05.255193	\N	\N
26	7	9	Term 1 2027	55.00	2026-07-29 13:39:07.336345	\N	\N
27	7	8	Term 1 2027	45.00	2026-07-29 13:39:10.269187	\N	\N
28	7	10	Term 1 2027	56.00	2026-07-29 13:39:15.185878	\N	\N
30	9	4	Term 1 2027	88.00	2026-07-29 13:39:36.711369	\N	\N
31	9	5	Term 1 2027	88.00	2026-07-29 13:39:37.483105	\N	\N
32	9	1	Term 1 2027	88.00	2026-07-29 13:39:38.372059	\N	\N
33	9	2	Term 1 2027	88.00	2026-07-29 13:39:39.19457	\N	\N
34	9	3	Term 1 2027	88.00	2026-07-29 13:39:40.085275	\N	\N
35	9	9	Term 1 2027	88.00	2026-07-29 13:39:41.013729	\N	\N
36	9	7	Term 1 2027	88.00	2026-07-29 13:39:41.822462	\N	\N
37	9	12	Term 1 2027	88.00	2026-07-29 13:39:43.489216	\N	\N
38	6	4	Term 1 2027	67.00	2026-07-29 13:40:16.262086	\N	\N
39	6	5	Term 1 2027	67.00	2026-07-29 13:40:17.028798	\N	\N
40	6	1	Term 1 2027	67.00	2026-07-29 13:40:17.767015	\N	\N
41	6	2	Term 1 2027	67.00	2026-07-29 13:40:18.791973	\N	\N
42	6	3	Term 1 2027	67.00	2026-07-29 13:40:19.524066	\N	\N
43	6	9	Term 1 2027	88.00	2026-07-29 13:40:21.276198	\N	\N
44	6	7	Term 1 2027	88.00	2026-07-29 13:40:22.830805	\N	\N
45	6	6	Term 1 2027	44.00	2026-07-29 13:40:24.900689	\N	\N
46	6	10	Term 1 2027	77.00	2026-07-29 13:40:27.14979	\N	\N
47	8	4	Term 1 2027	55.00	2026-07-29 13:40:53.69989	\N	\N
48	8	5	Term 1 2027	57.00	2026-07-29 13:40:56.205973	\N	\N
49	8	1	Term 1 2027	69.00	2026-07-29 13:40:59.356287	\N	\N
50	8	2	Term 1 2027	99.00	2026-07-29 13:41:01.77065	\N	\N
51	8	3	Term 1 2027	98.00	2026-07-29 13:41:04.383402	\N	\N
52	8	9	Term 1 2027	97.00	2026-07-29 13:41:12.166338	\N	\N
53	8	8	Term 1 2027	67.00	2026-07-29 13:41:14.560115	\N	\N
54	8	6	Term 1 2027	77.00	2026-07-29 13:41:16.299921	\N	\N
55	8	10	Term 1 2027	77.00	2026-07-29 13:41:20.322399	\N	\N
56	12	4	Term 1 2027	63.00	2026-07-30 20:07:29.17906	\N	\N
57	12	5	Term 1 2027	56.00	2026-07-30 20:07:31.064945	\N	\N
58	12	1	Term 1 2027	89.00	2026-07-30 20:07:32.647006	\N	\N
59	12	2	Term 1 2027	67.00	2026-07-30 20:07:34.420338	\N	\N
60	12	3	Term 1 2027	65.00	2026-07-30 20:07:36.105257	\N	\N
61	12	9	Term 1 2027	89.00	2026-07-30 20:07:37.689975	\N	\N
62	12	7	Term 1 2027	88.00	2026-07-30 20:07:39.537499	\N	\N
63	12	10	Term 1 2027	46.00	2026-07-30 20:08:06.622445	\N	\N
64	23	4	Term 2 2027	56.00	2026-07-31 00:50:21.998704	\N	\N
65	23	5	Term 2 2027	78.00	2026-07-31 00:50:23.518335	\N	\N
66	23	1	Term 2 2027	67.00	2026-07-31 00:50:24.569098	\N	\N
67	23	2	Term 2 2027	85.00	2026-07-31 00:50:25.471395	\N	\N
68	23	3	Term 2 2027	45.00	2026-07-31 00:50:28.153258	\N	\N
72	23	9	Term 2 2027	78.00	2026-07-31 00:50:44.247045	\N	\N
73	23	7	Term 2 2027	88.00	2026-07-31 00:50:50.839105	\N	\N
74	23	6	Term 2 2027	65.00	2026-07-31 00:50:53.219473	\N	\N
75	23	10	Term 2 2027	54.00	2026-07-31 00:50:59.308787	\N	\N
77	7	5	Term 2 2027	56.00	2026-07-31 00:51:38.935693	\N	\N
78	7	1	Term 2 2027	70.00	2026-07-31 00:51:45.970365	\N	\N
79	7	2	Term 2 2027	89.00	2026-07-31 00:51:47.123131	\N	\N
80	7	3	Term 2 2027	78.00	2026-07-31 00:51:49.940717	\N	\N
83	7	10	Term 2 2027	66.00	2026-07-31 00:51:59.653818	\N	\N
84	9	4	Term 2 2027	67.00	2026-07-31 00:52:30.892976	\N	\N
85	9	1	Term 2 2027	78.00	2026-07-31 00:52:33.899763	\N	\N
86	9	2	Term 2 2027	78.00	2026-07-31 00:52:36.041259	\N	\N
87	9	3	Term 2 2027	98.00	2026-07-31 00:52:36.957744	\N	\N
88	9	9	Term 2 2027	69.00	2026-07-31 00:52:42.093452	\N	\N
89	9	7	Term 2 2027	59.00	2026-07-31 00:52:45.742302	\N	\N
90	9	12	Term 2 2027	70.00	2026-07-31 00:52:47.944281	\N	\N
91	9	5	Term 2 2027	56.00	2026-07-31 00:52:56.383147	\N	\N
92	6	4	Term 2 2027	56.00	2026-07-31 00:53:27.368677	\N	\N
93	6	5	Term 2 2027	57.00	2026-07-31 00:53:30.019357	\N	\N
94	6	1	Term 2 2027	88.00	2026-07-31 00:53:33.505189	\N	\N
95	6	2	Term 2 2027	89.00	2026-07-31 00:53:39.290182	\N	\N
97	6	9	Term 2 2027	80.00	2026-07-31 00:53:46.737763	\N	\N
98	6	7	Term 2 2027	80.00	2026-07-31 00:53:49.576307	\N	\N
99	6	6	Term 2 2027	44.00	2026-07-31 00:53:57.956263	\N	\N
100	6	10	Term 2 2027	50.00	2026-07-31 00:54:03.192161	\N	\N
76	7	4	Term 2 2027	66.00	2026-07-31 00:51:34.208107	\N	\N
111	24	10	Term 2 2027	66.00	2026-07-31 00:56:06.131658	\N	\N
81	7	9	Term 2 2027	76.00	2026-07-31 00:51:52.624678	\N	\N
82	7	8	Term 2 2027	66.00	2026-07-31 00:51:55.80852	\N	\N
105	24	4	Term 2 2027	76.00	2026-07-31 00:55:52.470395	\N	\N
106	24	5	Term 2 2027	67.00	2026-07-31 00:55:53.722502	\N	\N
107	24	1	Term 2 2027	65.00	2026-07-31 00:55:55.172461	\N	\N
108	24	2	Term 2 2027	57.00	2026-07-31 00:55:57.183426	\N	\N
109	24	9	Term 2 2027	86.00	2026-07-31 00:56:00.344145	\N	\N
110	24	7	Term 2 2027	67.00	2026-07-31 00:56:01.705998	\N	\N
113	24	3	Term 2 2027	65.00	2026-07-31 00:56:13.902667	\N	\N
114	8	4	Term 2 2027	67.00	2026-07-31 00:56:38.476343	\N	\N
115	8	5	Term 2 2027	89.00	2026-07-31 00:56:41.979912	\N	\N
116	8	1	Term 2 2027	76.00	2026-07-31 00:56:44.024515	\N	\N
117	8	2	Term 2 2027	65.00	2026-07-31 00:56:45.850064	\N	\N
118	8	3	Term 2 2027	47.00	2026-07-31 00:56:47.332815	\N	\N
119	8	9	Term 2 2027	67.00	2026-07-31 00:56:50.751597	\N	\N
120	8	8	Term 2 2027	87.00	2026-07-31 00:56:52.239094	\N	\N
121	8	6	Term 2 2027	36.00	2026-07-31 00:56:56.426293	\N	\N
122	8	10	Term 2 2027	56.00	2026-07-31 00:57:04.211455	\N	\N
123	14	4	Term 1 2027	34.00	2026-07-31 00:59:00.240817	\N	\N
124	14	1	Term 1 2027	67.00	2026-07-31 00:59:02.870426	\N	\N
125	14	2	Term 1 2027	88.00	2026-07-31 00:59:05.746233	\N	\N
126	14	3	Term 1 2027	46.00	2026-07-31 00:59:10.722435	\N	\N
127	14	9	Term 1 2027	74.00	2026-07-31 00:59:14.174997	\N	\N
128	14	7	Term 1 2027	69.00	2026-07-31 00:59:17.328001	\N	\N
129	38	4	Term 2 2026	56.00	2026-08-02 14:48:44.313049	\N	\N
130	38	5	Term 2 2026	67.00	2026-08-02 14:48:47.02667	\N	\N
131	38	1	Term 2 2026	75.00	2026-08-02 14:48:48.544893	\N	\N
132	38	2	Term 2 2026	89.00	2026-08-02 14:48:49.43365	\N	\N
133	38	3	Term 2 2026	66.00	2026-08-02 14:48:51.158474	\N	\N
134	38	9	Term 2 2026	77.00	2026-08-02 14:48:54.627958	\N	\N
135	38	7	Term 2 2026	87.00	2026-08-02 14:48:56.935377	\N	\N
136	38	10	Term 2 2026	69.00	2026-08-02 14:49:00.319809	\N	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, student_id, type, payload, status, created_at) FROM stdin;
1	7	absence	Grace Njeri was marked absent on 2026-07-27	pending	2026-07-27 13:39:31.670155
2	14	absence	James Kariuki was marked absent on 2026-07-27	pending	2026-07-27 13:40:01.998923
3	4	absence	Kevin Mwangi was marked absent on 2026-07-27	pending	2026-07-27 13:40:16.368676
4	26	absence	Amos Aoko was marked absent on 2026-07-30	pending	2026-07-30 20:06:42.115112
5	9	absence	Mercy Chebet was marked absent on 2026-07-31	pending	2026-07-31 00:30:55.338664
\.


--
-- Data for Name: platform_admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.platform_admins (id, name, email, password_hash, created_at) FROM stdin;
1	Bennah	you@digistartech.co.ke	$2b$10$MqTdK/07llBsy0ENaDAFQOnrLddCK5aLlQpo86LrdqawVBOuu9yvy	2026-08-01 21:18:21.816064
\.


--
-- Data for Name: report_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_comments (id, student_id, term, teacher_comment, principal_comment) FROM stdin;
1	1	Term 2 2026	Excellent effort this term.	\N
2	7	Term 2 2026	You can do better on english	\N
3	7	Term 1 2027	You can do better	You need to put more effort
4	9	Term 1 2027	Congrats kiddo	You did well
5	6	Term 1 2027	You can do better in physics	Physics need more work - but overall you did good
6	8	Term 1 2027	Work hard on your sciences	Sciences need more effort
11	12	Term 1 2027	You have the potential of an A	You did well kiddo, but you need to improve on business\nKeep up the good work
13	23	Term 2 2027	Good job - You can do better	\N
15	9	Term 2 2027	You are improving	\N
16	6	Term 2 2027	you did well but you have to put in more effort in mathematics and your sciences	\N
14	7	Term 2 2027	I am seeing the improvement	\N
18	24	Term 2 2027	You have done well	\N
19	8	Term 2 2027	Work harder\n	\N
20	38	Term 2 2026	Well performed for the first time, but take a keen look on your sciences	Pull up your socks
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, created_at, next_admission_number, subdomain, custom_domain, logo_url, brand_color, status, contact_name, contact_email, rejection_reason) FROM stdin;
1	Maono School	2026-07-27 01:15:41.879033	9	maono	\N	\N	\N	active	\N	\N	\N
3	Mixa school	2026-08-02 02:43:23.854486	1	mixa	\N	\N	#2994ff	rejected	princi mixa	princimixa@gmail.com	\N
2	greatwall	2026-08-01 21:26:41.368155	5607	greatwall	\N	\N	#3d948f	active	Benard Mutuku	bennah995@gmail.com	\N
4	Langata West School	2026-08-02 02:45:54.691233	89710	langata-west-school	\N	\N	#1A3C5E	active	Jane Sungu	sungu001@mail.com	\N
\.


--
-- Data for Name: student_subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_subjects (id, student_id, subject_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	10
10	7	4
11	7	5
12	7	1
13	7	2
14	7	3
15	7	9
16	7	8
17	7	10
18	9	4
19	9	5
20	9	1
21	9	2
22	9	3
23	9	9
24	9	7
25	9	12
26	6	4
27	6	5
28	6	1
29	6	2
30	6	3
31	6	6
32	6	9
33	6	7
34	6	10
44	12	4
45	12	5
46	12	1
47	12	2
48	12	3
49	12	9
50	12	7
51	12	10
52	23	4
53	23	5
54	23	1
55	23	2
56	23	3
57	23	6
58	23	9
59	23	7
60	23	10
61	24	4
62	24	5
63	24	1
64	24	2
65	24	3
66	24	9
67	24	7
68	24	10
69	8	4
70	8	5
71	8	1
72	8	2
73	8	3
74	8	9
75	8	8
76	8	10
77	14	4
78	14	5
79	14	1
80	14	2
81	14	3
82	14	9
83	14	7
84	14	10
85	38	4
86	38	5
87	38	1
88	38	2
89	38	3
90	38	9
91	38	7
92	38	10
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, school_id, class_id, name, created_at, status, admission_number) FROM stdin;
1	1	1	Amina Otieno	2026-07-27 01:40:13.259719	active	\N
2	1	1	Brian Kiptoo	2026-07-27 01:40:13.266133	active	\N
3	1	1	Faith Wanjiru	2026-07-27 01:40:13.268951	active	\N
4	1	1	Kevin Mwangi	2026-07-27 01:40:13.271708	active	\N
5	1	1	Lucy Achieng	2026-07-27 01:40:13.274022	active	\N
18	1	5	Joseph Njoroge	2026-07-27 13:08:24.031569	graduated	\N
19	1	5	Diana Akinyi	2026-07-27 13:08:24.033388	graduated	\N
20	1	5	Patrick Mwangi	2026-07-27 13:08:24.035276	graduated	\N
21	1	5	Lilian Chepkoech	2026-07-27 13:08:24.037034	graduated	\N
14	1	5	James Kariuki	2026-07-27 13:08:24.02167	active	\N
15	1	5	Sarah Adhiambo	2026-07-27 13:08:24.023226	active	\N
16	1	5	Michael Kiprono	2026-07-27 13:08:24.02458	active	\N
17	1	5	Ann Wairimu	2026-07-27 13:08:24.026091	active	\N
25	1	5	James Kinuthis	2026-07-30 18:49:44.331699	active	3
26	1	5	Amos Aoko	2026-07-30 18:49:52.433951	active	4
27	1	5	Kendrik Lamar	2026-07-30 18:50:01.006016	active	5
10	1	4	David Mutua	2026-07-27 13:08:24.007137	active	\N
11	1	4	Esther Wambui	2026-07-27 13:08:24.011695	active	\N
12	1	4	Collins Omondi	2026-07-27 13:08:24.014786	active	\N
13	1	4	Ruth Nyambura	2026-07-27 13:08:24.017054	active	\N
22	1	4	Ruth Kimani	2026-07-29 23:57:23.187954	active	\N
6	1	3	Peter Kamau	2026-07-27 13:08:23.968361	active	\N
7	1	3	Grace Njeri	2026-07-27 13:08:23.98328	active	\N
8	1	3	Samuel Odhiambo	2026-07-27 13:08:23.986465	active	\N
9	1	3	Mercy Chebet	2026-07-27 13:08:23.991412	active	\N
23	1	3	Angela Grace	2026-07-30 14:06:19.315675	active	1
24	1	3	Samson Jackson	2026-07-30 18:49:33.212995	active	2
28	1	2	Amos Josh	2026-07-31 01:12:43.417589	active	6
29	1	2	Kelvin Kimani	2026-07-31 01:13:01.227021	active	7
30	1	2	Gabrie; Jesus	2026-07-31 01:13:13.294353	active	8
31	2	6	Tony Mochama	2026-08-02 02:10:26.563109	active	5600
32	2	6	Nick Kanon	2026-08-02 02:10:32.036203	active	5601
33	2	6	Jeremiah Muthimo	2026-08-02 02:10:41.325278	active	5602
34	2	7	James Kuria	2026-08-02 02:10:55.360498	active	5603
35	2	7	Hanna Gitau	2026-08-02 02:11:02.371973	active	5604
36	2	7	Maina Njoroge	2026-08-02 02:11:16.227637	active	5605
37	2	7	Paul Arubaidi	2026-08-02 02:11:27.222944	active	5606
38	4	8	James kamau	2026-08-02 14:46:14.950103	active	89706
39	4	9	Jones Mburu	2026-08-02 14:46:30.420092	active	89707
40	4	10	Kimani Ichungwa	2026-08-02 14:46:43.978301	active	89708
41	4	11	Gerald hamaru	2026-08-02 14:47:01.695417	active	89709
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subjects (id, name, category) FROM stdin;
1	English	compulsory
2	Kiswahili	compulsory
3	Mathematics	compulsory
4	Biology	compulsory
5	Chemistry	compulsory
6	Physics	optional_compulsory
7	History & Government	humanities
8	Geography	humanities
9	CRE/IRE/HRE	humanities
10	Business Studies	technical
11	Agriculture	technical
12	Computer Studies	technical
\.


--
-- Data for Name: terms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.terms (id, name, year, is_active, created_at) FROM stdin;
2	Term 3	2026	f	2026-07-28 03:01:39.153774
3	Term 1	2026	f	2026-07-28 03:10:56.749158
5	Term 1	2027	f	2026-07-28 21:16:28.92625
6	Term 2	2027	f	2026-07-31 00:31:21.16604
1	Term 2	2026	t	2026-07-28 02:30:52.655362
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, school_id, name, email, password_hash, role, created_at, is_active, must_change_password) FROM stdin;
1	1	Jane Principal	principal@maono.school	$2b$10$FL.eerrFY90p5h6xN3LdXOApvGK20U6t4Ilh.PhUJreFcu0dD8EJe	principal	2026-07-27 01:15:42.240235	t	f
2	1	John Teacher	teacher@maono.school	$2b$10$NnkGgk/Ioc17NjFbMB4J6e.jXxp9kNfsg9GDEmIyLQHClMTMMEeCG	teacher	2026-07-27 01:15:42.261769	t	f
7	1	james owino	james@maono.school	$2b$10$AZhGDftPqOCQhi.HLeXNiucZWKrkczKgMWGAvjFErbUQ1mSBMvH/e	teacher	2026-07-29 14:00:08.584589	f	f
8	1	Jane Kimani	jane@maono.school	$2b$10$M./M6UBJUGKlOdgCSgfIdeB6k9h8lO57p2q4fXjc2bE46X7Trk29m	teacher	2026-07-31 00:38:37.439126	t	f
9	2	Benard Mutuku	bennah995@gmail.com	$2b$10$goYRPykDxVXnjkBxIOMSDebEqrb0V0fgCGWp/G2zp9HSS9YSH2.Pu	principal	2026-08-01 21:33:49.748684	t	f
10	2	Habakkuk Malume	malume@teacher.com	$2b$10$.Y.C1xlIvUqX6Gexb.HXFu/YVs.uB2yGGghdEtme/Gex7D5HGSnzC	teacher	2026-08-01 21:44:01.49699	t	f
11	4	Jane Sungu	sungu001@mail.com	$2b$10$dXn/c5u0KJzSIBVyHoWRMeYC5ILHo3lp4pBH9894AVT6xL8FHNRzq	principal	2026-08-02 02:52:48.286461	t	f
12	4	Juliana	jully@sungu.school	$2b$10$dHmRWft1IeyT.MKAOZUwqOspKIgH4X4FHoTYb./dovY065k53A9zK	teacher	2026-08-02 14:47:49.998541	t	f
13	4	Mike Munene	mikemunene@sungu.com	$2b$10$v3r6b3VBwQFeiIjLVdXu3udtA0zUXFzUI.MfyXMZ5TnoYt3PyCjmC	teacher	2026-08-02 15:03:29.614781	t	f
14	4	Karen Nyamu	knyamu@sungu.com	$2b$10$DFIupVTq87Au3khvf85wA.lGOFlez0X4jcH9NzaxrWjejy8.wmOHq	teacher	2026-08-02 15:08:02.852922	t	f
\.


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attendance_id_seq', 98, true);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.classes_id_seq', 11, true);


--
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grades_id_seq', 136, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 5, true);


--
-- Name: platform_admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.platform_admins_id_seq', 1, true);


--
-- Name: report_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.report_comments_id_seq', 21, true);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_id_seq', 4, true);


--
-- Name: student_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_subjects_id_seq', 92, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_id_seq', 41, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subjects_id_seq', 12, true);


--
-- Name: terms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.terms_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_student_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_student_id_date_key UNIQUE (student_id, date);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: grades grades_student_id_subject_id_term_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_subject_id_term_key UNIQUE (student_id, subject_id, term);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: platform_admins platform_admins_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_admins
    ADD CONSTRAINT platform_admins_email_key UNIQUE (email);


--
-- Name: platform_admins platform_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_admins
    ADD CONSTRAINT platform_admins_pkey PRIMARY KEY (id);


--
-- Name: report_comments report_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_comments
    ADD CONSTRAINT report_comments_pkey PRIMARY KEY (id);


--
-- Name: report_comments report_comments_student_id_term_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_comments
    ADD CONSTRAINT report_comments_student_id_term_key UNIQUE (student_id, term);


--
-- Name: schools schools_custom_domain_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_custom_domain_key UNIQUE (custom_domain);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: schools schools_subdomain_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_subdomain_key UNIQUE (subdomain);


--
-- Name: student_subjects student_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_pkey PRIMARY KEY (id);


--
-- Name: student_subjects student_subjects_student_id_subject_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_student_id_subject_id_key UNIQUE (student_id, subject_id);


--
-- Name: students students_admission_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_admission_number_key UNIQUE (admission_number);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_name_key UNIQUE (name);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: terms terms_name_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_name_year_key UNIQUE (name, year);


--
-- Name: terms terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: one_active_term; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX one_active_term ON public.terms USING btree (is_active) WHERE (is_active = true);


--
-- Name: attendance attendance_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: attendance attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: attendance attendance_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_term_id_fkey FOREIGN KEY (term_id) REFERENCES public.terms(id);


--
-- Name: classes classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: classes classes_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id);


--
-- Name: grades grades_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: grades grades_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: grades grades_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_term_id_fkey FOREIGN KEY (term_id) REFERENCES public.terms(id);


--
-- Name: notifications notifications_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: report_comments report_comments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_comments
    ADD CONSTRAINT report_comments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_subjects student_subjects_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_subjects student_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: students students_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id);


--
-- Name: students students_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: users users_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Sz3EqJH4hb9Ecx324H1n7iKkqRhNTXoF9lrRYrmdhU2woYfCr5Xjp5RNVTw3yre

